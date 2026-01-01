package handlers

import (
	"errors"
	"strings"

	"github.com/MadMax168/Readsum/config"
	"github.com/MadMax168/Readsum/customerrors"
	"github.com/MadMax168/Readsum/middleware"
	"github.com/MadMax168/Readsum/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// DTO
type UserResponse struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func Register(c *fiber.Ctx) error {
	var input RegisterInput

	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	input.Name = strings.TrimSpace(strings.ToLower(input.Name))
	input.Email = strings.TrimSpace(strings.ToLower(input.Email))

	if input.Name == "" || input.Email == "" || input.Password == "" {
		return customerrors.NewBadRequestError("Name, email, and password are required")
	}

	if len(input.Password) < 6 {
		return customerrors.NewBadRequestError("Password must be at least 6 characters")
	}

	var existingUser models.User

	if err := config.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		return customerrors.NewConflictError("Email already registered")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return customerrors.NewInternalServerError("Database error")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return customerrors.NewInternalServerError("Failed to process password")
	}

	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to create user")
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data": UserResponse{
			Name:  user.Name,
			Email: user.Email,
		},
		"message": "User registered successfully",
	})
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var input LoginInput

	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	input.Email = strings.TrimSpace(strings.ToLower(input.Email))
	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return customerrors.NewUnauthorizedError("Invalid email or password")
		}
		return customerrors.NewInternalServerError("Database error")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return customerrors.NewConflictError("Incorrect password")
	}

	token, err := middleware.GenerateToken(user.ID)
	if err != nil {
		return customerrors.NewInternalServerError("Failed to generate token")
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"token": token,
			"user": UserResponse{
				Name:  user.Name,
				Email: user.Email,
			},
		},
		"message": "Login successful",
	})
}

func GetUser(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication required")
	}
	var user models.User

	result := config.DB.First(&user, UID)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return customerrors.NewNotFoundError("User not found")
		} else {
			return customerrors.NewInternalServerError("Database query failed")
		}
	}

	response := UserResponse{
		Name:  user.Name,
		Email: user.Email,
	}

	return c.Status(200).JSON(response)
}

type PasswordUpdate struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func UpdPass(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return customerrors.NewUnauthorizedError("Autentication required")
	}

	var input PasswordUpdate

	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body format")
	}

	if len(input.NewPassword) < 6 {
		return customerrors.NewBadRequestError("New password must be at least 6 characters")
	}
	if input.OldPassword == input.NewPassword {
		return customerrors.NewBadRequestError("New password must be different from old password")
	}

	var user models.User
	result := config.DB.First(&user, UID)

	if result.RowsAffected == 0 {
		return customerrors.NewNotFoundError("User not found")
	}
	if result.Error != nil {
		return customerrors.NewInternalServerError("Database error during user fetch")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.OldPassword)); err != nil {
		return customerrors.NewUnauthorizedError("Invalid password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return customerrors.NewInternalServerError("Failed to process new password hash")
	}

	if err := config.DB.Model(&user).Update("PasswordHash", string(hashedPassword)).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to save new password")
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Password updated successfully",
	})
}

package handlers

import (
	"errors"
	"strings"

	"github.com/MadMax168/Readsum/config"
	"github.com/MadMax168/Readsum/customerrors"
	"github.com/MadMax168/Readsum/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ChatResp struct {
	Index uint   `json:"index"`
	Title string `json:"title"`
}

func GetChat(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication required")
	}

	var cxs []models.Chat
	if err := config.DB.Where("user_id = ?", UID).Find(&cxs).Error; err != nil {
		return customerrors.NewInternalServerError("Database error")
	}

	var response []ChatResp
	for _, i := range cxs {
		response = append(response, ChatResp{
			Index: i.ID,
			Title: i.Title,
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data":    response,
		"message": "Chats retrieved successfully",
	})
}

type CreateChatInput struct {
	Title string `json:"title"`
}

func Create(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication token is invalid or missing user ID.")
	}

	var input CreateChatInput
	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	input.Title = strings.TrimSpace(input.Title)
	if input.Title == "" {
		return customerrors.NewBadRequestError("Chat title is required")
	}

	chat := models.Chat{
		Title:  input.Title,
		UserID: UID,
	}

	if err := config.DB.Create(&chat).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to create chat")
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    chat,
		"message": "Chat created successfully",
	})
}

type UpdateChatInput struct {
	Title string `json:"title"`
}

func UpdChat(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication required")
	}

	CID := c.Params("chatID")

	var input UpdateChatInput
	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	var chat models.Chat
	result := config.DB.Where("user_id = ? AND id = ?", UID, CID).First(&chat)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return customerrors.NewNotFoundError("Chat not found")
		}
		return customerrors.NewInternalServerError("Database error")
	}

	if err := config.DB.Model(&chat).Update("title", input.Title).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to update chat")
	}

	config.DB.First(&chat, CID)
	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data":    chat,
		"message": "Chat updated successfully",
	})
}

func DelChat(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication required")
	}

	CID := c.Params("chatID")

	var chat models.Chat
	result := config.DB.Where("user_id = ? AND id = ?", UID, CID).Delete(&chat)

	if result.Error != nil {
		return customerrors.NewInternalServerError("Failed to delete chat")
	}

	if result.RowsAffected == 0 {
		return customerrors.NewNotFoundError("Chat not found")
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "Chat deleted successfully",
	})
}

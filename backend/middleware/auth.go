package middleware

import (
	"os"
	"strings"

	"github.com/MadMax168/Readsum/customerrors"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

//Authentication
func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader  == "" {
		return customerrors.NewInternalServerError("Missing authorization header")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
		return customerrors.NewInternalServerError("Server configuration error: JWT secret not set")
    }

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, customerrors.NewInternalServerError("Unexpected signing method")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return customerrors.NewUnauthorizedError("Invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return customerrors.NewUnauthorizedError("Invalid token claims")
	}

	userID, ok := claims["user_id"].(float64)
	if !ok {
		return customerrors.NewUnauthorizedError("Invalid user ID in token")
	}

	c.Locals("userID", uint(userID))
	return c.Next()
}
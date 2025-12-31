package handlers

import (
	"github.com/MadMax168/Readsum/config"
	"github.com/MadMax168/Readsum/customerrors"
	"github.com/MadMax168/Readsum/models"
	"github.com/gofiber/fiber/v2"
)

func Create(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok || UID == 0 {
		return customerrors.NewUnauthorizedError("Authentication token is invalid or missing user ID.")
	}

	chat := new(models.Chat)
	if err := c.BodyParser(&chat); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	chat.UserID = UID
	config.DB.Create(&chat)
	return c.Status(200).JSON(chat)
}

func
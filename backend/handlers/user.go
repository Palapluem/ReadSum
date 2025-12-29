package handlers

import (
	"backend/config"

	"github.com/gofiber/fiber/v2"
)

func GetMe(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	var user models.user
	result := config.DB.First(&user, UID)
	if result.Error != nil {
		return c.SendStatus(404)
	}

	return c.Status(200).JSON(&user)
}

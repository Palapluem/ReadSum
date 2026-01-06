package middleware

import (
	"strconv"

	"github.com/MadMax168/Readsum/customerrors"
	"github.com/gofiber/fiber/v2"
)

// ChatIDMiddleware ดึง chatID จาก URL parameters แล้วแปลงเป็น uint
func ChatIDMiddleware(c *fiber.Ctx) error {
	chatIdParam := c.Params("chatID")
	if chatIdParam == "" {
		// กรณีเรียกใช้ผ่าน Group ที่ไม่มี parameter อาจจะต้องข้าทไปก่อน
		return c.Next()
	}

	cid, err := strconv.ParseUint(chatIdParam, 10, 64)
	if err != nil {
		return customerrors.NewBadRequestError("Invalid chat ID format")
	}

	// เก็บค่า chatID ไว้ใน Locals เพื่อให้ Handler เอาไปใช้ต่อได้สะดวก
	c.Locals("chatID", uint(cid))

	return c.Next()
}

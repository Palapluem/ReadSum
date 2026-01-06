package handlers

import (
	"strings"

	"github.com/MadMax168/Readsum/config"
	"github.com/MadMax168/Readsum/customerrors"
	"github.com/MadMax168/Readsum/models"
	"github.com/MadMax168/Readsum/services"
	"github.com/gofiber/fiber/v2"
)

type TextResp struct {
	Index              uint   `json:"index"`
	Role               string `json:"role"`
	Text               string `json:"text"`
	RelatedDocumentIDs []uint `json:"related_document_ids,omitempty"`
	CreatedAt          string `json:"created_at"`
}

func GetMessage(c *fiber.Ctx) error {
	CID, ok := c.Locals("chatID").(uint)
	if !ok || CID == 0 {
		return customerrors.NewBadRequestError("Invalid chat ID")
	}

	var mxs []models.Message
	if err := config.DB.Where("chat_id = ?", CID).
		Order("created_at ASC").
		Find(&mxs).Error; err != nil {
		return customerrors.NewInternalServerError("Database error")
	}

	var response []TextResp
	for _, msg := range mxs {
		response = append(response, TextResp{
			Index:              msg.ID,
			Role:               msg.Role,
			Text:               msg.Text,
			RelatedDocumentIDs: msg.RelatedDocumentIDs,
			CreatedAt:          msg.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data":    response,
		"message": "message retrieved successfully",
	})
}

type PostMessageInput struct {
	Text string `json:"text"`
	Role string `json:"role"`
}

func PostMessage(c *fiber.Ctx) error {
	CID, ok := c.Locals("chatID").(uint)
	if !ok || CID == 0 {
		return customerrors.NewBadRequestError("Invalid chat ID")
	}

	var input PostMessageInput
	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	input.Text = strings.TrimSpace(input.Text)
	if input.Text == "" {
		return customerrors.NewBadRequestError("Message text cannot be empty")
	}

	input.Role = strings.ToLower(strings.TrimSpace(input.Role))
	if input.Role != "user" && input.Role != "assistant" {
		return customerrors.NewBadRequestError("Role must be 'user' or 'assistant'")
	}

	var chat models.Chat
	UID, _ := c.Locals("userID").(uint)
	if err := config.DB.Where("id = ? AND user_id = ?", CID, UID).First(&chat).Error; err != nil {
		return customerrors.NewNotFoundError("Chat not found")
	}

	message := models.Message{
		Text:   input.Text,
		Role:   input.Role,
		ChatID: CID,
	}

	if err := config.DB.Create(&message).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to create message")
	}

	// AI Process: ถ้าคนส่งคือ User ให้ AI ตอบกลับด้วย
	var aiResponse *TextResp
	if message.Role == "user" {
		aiText, err := services.GenerateContent(message.Text)
		if err == nil {
			// บันทึกคำตอบของ AI ลง DB
			aiMsg := models.Message{
				Text:   aiText,
				Role:   "assistant",
				ChatID: CID,
			}
			if err := config.DB.Create(&aiMsg).Error; err == nil {
				aiResponse = &TextResp{
					Index:     aiMsg.ID,
					Role:      aiMsg.Role,
					Text:      aiMsg.Text,
					CreatedAt: aiMsg.CreatedAt.Format("2006-01-02 15:04:05"),
				}
			}
		}
		// Note: ถ้า AI error อาจจะไม่ต้อง return error ให้ user หรือ log ไว้เฉยๆ ก็ได้
		// แต่ในที่นี้จะปล่อยผ่านไปก่อน ให้ user เห็นแค่ข้อความตัวเอง
	}

	responseMap := fiber.Map{
		"success": true,
		"data": TextResp{
			Index:     message.ID,
			Role:      message.Role,
			Text:      message.Text,
			CreatedAt: message.CreatedAt.Format("2006-01-02 15:04:05"),
		},
		"message": "Message created successfully",
	}

	// ถ้ามี AI Response ให้ส่งกลับไปด้วย (Optional)
	if aiResponse != nil {
		responseMap["ai_response"] = aiResponse
	}

	return c.Status(201).JSON(responseMap)
}

type UpdMessageInput struct {
	Text string `json:"text"`
}

func UpdMessage(c *fiber.Ctx) error {
	CID, ok := c.Locals("chatID").(uint)
	if !ok || CID == 0 {
		return customerrors.NewBadRequestError("Invalid chat ID")
	}

	MID := c.Params("messageID")
	if MID == "" {
		return customerrors.NewBadRequestError("Message ID is required")
	}

	var input UpdMessageInput
	if err := c.BodyParser(&input); err != nil {
		return customerrors.NewBadRequestError("Invalid request body")
	}

	input.Text = strings.TrimSpace(input.Text)
	if input.Text == "" {
		return customerrors.NewBadRequestError("Message text cannot be empty")
	}

	var message models.Message
	if err := config.DB.Where("id = ? AND chat_id = ?", MID, CID).First(&message).Error; err != nil {
		return customerrors.NewNotFoundError("Message not found")
	}

	if message.Role == "assistant" {
		return customerrors.NewForbiddenError("Cannot edit assistant messages")
	}

	if err := config.DB.Model(&message).Update("text", input.Text).Error; err != nil {
		return customerrors.NewInternalServerError("Failed to update message")
	}

	config.DB.First(&message, MID)

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data": TextResp{
			Index:     message.ID,
			Role:      message.Role,
			Text:      message.Text,
			CreatedAt: message.CreatedAt.Format("2006-01-02 15:04:05"),
		},
		"message": "Message updated successfully",
	})
}

func DelMessage(c *fiber.Ctx) error {
	CID, ok := c.Locals("chatID").(uint)
	if !ok || CID == 0 {
		return customerrors.NewBadRequestError("Invalid chat ID")
	}

	MID := c.Params("messageID")
	if MID == "" {
		return customerrors.NewBadRequestError("Message ID is required")
	}

	var message models.Message
	result := config.DB.Where("id = ? AND chat_id = ?", MID, CID).Delete(&message)

	if result.Error != nil {
		return customerrors.NewInternalServerError("Failed to delete message")
	}

	if result.RowsAffected == 0 {
		return customerrors.NewNotFoundError("Message not found")
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "Message deleted successfully",
	})
}

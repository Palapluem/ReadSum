package models

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	Text     string `json:"text"`
	Response string `json:"responsse"`
	UserID   uint
	User     User
	ChatID   uint
	Chat     Chat
}

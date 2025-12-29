package models

import "gorm.io/gorm"

type message struct {
	gorm.Model
	Text     string `json:"text"`
	Response string `json:"responsse"`
	UserID   uint
	ChatID   uint
}

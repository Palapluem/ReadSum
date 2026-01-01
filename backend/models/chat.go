package models

import (
	"gorm.io/gorm"
)

type Chat struct {
	gorm.Model
	Title  string `json:"title" gorm:"not null"`
	UserID uint   `json:"user_id" gorm:"not null;index"`
	User   User   `json:"user,omitempty" gorm:"constraint:OnDelete:CASCADE"`
	//Relationships
	Documents []Document `json:"documents,omitempty" gorm:"foreignKey:ChatID"`
	Messages  []Message  `json:"messages,omitempty" gorm:"foreignKey:ChatID"`
}

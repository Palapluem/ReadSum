package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name         string `json:"name" gorm:"not null"`
	Email        string `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string `json:"-" gorm:"not null"`
	//Relationships
	Chat []Chat     `json:"chats,omitempty" gorm:"foreignKey:UserID"`
	Docs []Document `json:"documents,omitempty" gorm:"foreignKey:UserID"`
}

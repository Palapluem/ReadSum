package models

import "gorm.io/gorm"

type user struct {
	gorm.Model
	Name     string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Chat     []chat
	Docs     []docs
}

package models

import "gorm.io/gorm"

type docs struct {
	gorm.Model
	Title   string `json:"title"`
	Type    string `json:"type"`
	Url     string `json:"url"`
	Summary string `json:"summary"`
	Status  string `json:"status"`
	UserID  uint

	Connect []relationship
}

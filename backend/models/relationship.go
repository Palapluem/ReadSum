package models

import "gorm.io/gorm"

type relationship struct {
	gorm.Model
	Score float64 `json:"score"`
	Key   string  `json:"key"`

	Docs1 uint
	Docs2 uint
}

package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type UintArray []uint

func (u UintArray) Value() (driver.Value, error) {
	return json.Marshal(u)
}

func (u *UintArray) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to scan UintArray")
	}
	return json.Unmarshal(bytes, u)
}

type Message struct {
	gorm.Model
	Text               string    `json:"text" gorm:"type:text;not null"`
	Role               string    `json:"role" gorm:"type:varchar(20);not null"`
	RelatedDocumentIDs UintArray `json:"related_document_idx" gorm:"type:json"`
	//ForeignKeys
	ChatID uint `json:"chat_id" gorm:"not null;index"`
	Chat   Chat `json:"chat,omitempty" gorm:"constraint:OnDelete:CASCADE"`
}

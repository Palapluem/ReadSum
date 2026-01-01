package models

import (
	"time"

	"gorm.io/gorm"
)

type Document struct {
	gorm.Model
	Title      string    `json:"title" gorm:"not null"`
	FileType   string    `json:"file_type" gorm:"type:varchar(20);not null"`
	FileUrl    string    `json:"file_url" gorm:"not null"`
	Summary    string    `json:"summary" gorm:"type:text"`
	RawText    string    `json:"raw_text" gorm:"type:text"`
	Status     string    `json:"status" gorm:"type:varchar(20);default:'processing'"`
	FileSize   int64     `json:"file_size"`
	WordCount  int       `json:"word_count"`
	UploadDate time.Time `json:"upload_date" gorm:"autoCreateTime"`
	//ForeignKeys
	UserID uint `json:"user_id" gorm:"not null;index"`
	User   User `json:"user,omitempty" gorm:"constraint:OnDelete:CASCADE"`

	ChatID uint `json:"chat_id" gorm:"not null;index"`
	Chat   Chat `json:"chat,omitempty" gorm:"constraint:OnDelete:CASCADE"`
	//Relationships
	SourceRalations []Relationship `json:"source_relations,omitempty" gorm:"foreignKey:SourceDocID"`
	TargetRelations []Relationship `json:"target_relations,omitempty" gorm:"foreignKey:TargetDocID"`
}

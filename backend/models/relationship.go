package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type StringArray []string

func (s StringArray) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *StringArray) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to scan StringArray")
	}
	return json.Unmarshal(bytes, s)
}

type Relationship struct {
	gorm.Model
	SourceDocID     uint        `json:"source_doc_id" gorm:"not null;index:idx_source_target"`
	TargetDocID     uint        `json:"target_doc_id" gorm:"not null;index:idx_source_target"`
	SimilarityScore float64     `json:"similarity_score" gorm:"type:decimal(3,2);not null"`
	SharedConcepts  StringArray `json:"shared_concept" gorm:"type:json"`
	ChatID          uint        `json:"chat_id" gorm:"not null;index"`
	//Relationship
	SourceDoc Document `json:"source_doc,omitempty" gorm:"foreignKey:SourceDocID"`
	TargetDoc Document `json:"target_doc,omitempty" gorm:"foreignKey:TargetDocID"`
}

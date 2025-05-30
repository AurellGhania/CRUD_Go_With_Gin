package models

import (
	"gorm.io/gorm"
)

type Ads struct {
	gorm.Model
	Title       string   `json:"title"`
	ImageURL    string   `json:"image_url"`
	Description string   `json:"description"` // Optional
	Terms       string   `json:"terms"`       // Optional
	CategoryID  uint     `json:"category_id"`
	Category    Category `gorm:"foreignKey:CategoryID" json:"category"`
}

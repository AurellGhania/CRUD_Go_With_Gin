package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string `json:"name"`
	Ads  []Ads  `json:"ads" gorm:"foreignKey:CategoryID"`
}
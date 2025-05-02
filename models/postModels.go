package models

import "gorm.io/gorm"

type Trying struct {
	gorm.Model
	Title    string
	Body     string
	ImageURL string `gorm:"not null"`
}

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"unique"`
	Password string
}

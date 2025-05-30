package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name      string
	Users     []UserAuth `gorm:"foreignKey:RoleID"` // Satu role bisa punya banyak user
}
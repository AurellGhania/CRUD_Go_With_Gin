package models

import "gorm.io/gorm"

type UserAuth struct {
	gorm.Model
	Username      string
	Email         string `json:"email" gorm:"unique"`
	Password      string
	UserProfileID uint
	UserProfile   UserProfile `gorm:"foreignKey:UserProfileID"`
	RoleID        *uint
	Role          Role `gorm:"foreignKey:RoleID"`
}

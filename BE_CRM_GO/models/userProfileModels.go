package models

import "gorm.io/gorm"

type UserProfile struct {
	gorm.Model
	Username    string
	Email       string `json:"email" gorm:"unique"`
	PhoneNumber string

	IsActive    *bool  `gorm:"default:true"` // opsional: hanya berlaku untuk user biasa
	VoucherID   *uint  // bisa null kalau profile ini milik CRM
	IsCRMProfile bool  `gorm:"default:false"` // penanda profile ini milik CRM atau bukan
}
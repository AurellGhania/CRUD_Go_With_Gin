package models

import (
	"time"

	"gorm.io/gorm"
)

type Voucher struct {
	gorm.Model
	Code           string    `json:"code"`
	SalesID        *uint     `json:"sales_id"` // optional
	Duration       uint      `json:"duration"`
	ExpiredVoucher time.Time `json:"expired_voucher"`
	ExpiredUse     time.Time `json:"expired_use"`

	Products []Product `gorm:"many2many:voucher_has_products;" json:"products"`
}

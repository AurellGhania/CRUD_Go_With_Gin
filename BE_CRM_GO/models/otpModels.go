package models

import "time"

type OTP struct {
	ID        uint   `gorm:"primaryKey"`
	Email     string `gorm:"uniqueIndex"`
	Code      string
	CreatedAt time.Time
	ExpiredAt time.Time
}

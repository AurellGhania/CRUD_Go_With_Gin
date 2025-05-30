package utils

import (
	"net/smtp"
	"os"
)

func SendEmail(to string, otp string) error {
	from := os.Getenv("EMAIL_SENDER")
	password := os.Getenv("EMAIL_PASSWORD")

	// SMTP config
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	msg := []byte("Subject: Your OTP Code\n\nYour OTP code is: " + otp)

	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
	return err
}

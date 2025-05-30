package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/aurellghania/crud-golang/utils"
	"github.com/gin-gonic/gin"
)

func SendOtp(c *gin.Context) {
	type Request struct {
		Email string `json:"email"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	otp := fmt.Sprintf("%05d", rand.Intn(100000))
	expiredAt := time.Now().Add(5 * time.Minute)

	otpRecord := models.OTP{
		Email:     req.Email,
		Code:      otp,
		CreatedAt: time.Now(),
		ExpiredAt: expiredAt,
	}

	// Upsert
	initializers.DB.Where("email = ?", req.Email).Delete(&models.OTP{})
	initializers.DB.Create(&otpRecord)

	// Kirim email
	err := utils.SendEmail(req.Email, otp)
	if err != nil {
		fmt.Println("[GOLANG] Gagal kirim OTP:", err)

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func VerifyOtp(c *gin.Context) {
	type Request struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var otp models.OTP
	result := initializers.DB.First(&otp, "email = ?", req.Email)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP not found"})
		return
	}

	if otp.Code != req.Code {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP does not match"})
		return
	}

	if time.Now().After(otp.ExpiredAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP has expired"})
		return
	}

	// OTP valid
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}

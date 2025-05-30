package controllers

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Login User
func LoginUser(c *gin.Context) {
	type LoginRequest struct {
		Login    string `json:"login" binding:"required"` // Bisa email atau username
		Password string `json:"password" binding:"required"`
	}

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.UserAuth

	// Cek apakah input berupa email (mengandung "@")
	query := initializers.DB.Preload("Role")
	if isEmail(req.Login) {
		query = query.Where("email = ?", req.Login)
	} else {
		query = query.Where("username = ?", req.Login)
	}

	if err := query.First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid login or password"})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid login or password"})
		return
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
		"role": user.Role.Name,
	})

	// Sign the token
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Set token in cookie
	c.SetCookie("Authorization", tokenString, 3600*24, "/", "", false, true)

	// Response terakhir
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   tokenString,
		"user": gin.H{
			"ID":           user.ID,
			"Username":     user.Username,
			"email":        user.Email,
			"role":         user.Role.Name,
			"phone_number": user.UserProfile.PhoneNumber, // tambah ini
		},
	})

}

// Helper function untuk cek apakah input adalah email
func isEmail(input string) bool {
	return strings.Contains(input, "@")
}

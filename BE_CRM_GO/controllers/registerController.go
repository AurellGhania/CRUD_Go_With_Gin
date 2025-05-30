package controllers

import (
	"fmt"
	"net/http"

	"github.com/aurellghania/crud-golang/constants"
	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context) {
	type RegisterRequest struct {
		Username     string `json:"username"`
		Password     string `json:"password"`
		Email        string `json:"email"`
		PhoneNumber  string `json:"phone_number"`
		IsCRMProfile bool   `json:"is_crm_profile"` // Menandakan apakah ini CRM atau bukan
	}

	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Tentukan role, jika IsCRMProfile true maka role CRM, jika tidak maka role user
	var role models.Role
	roleName := constants.RoleUser // Default jadi 'user'
	if req.IsCRMProfile {
		roleName = constants.RoleCRM
	}

	// Cari role berdasarkan name
	if err := initializers.DB.First(&role, "name = ?", roleName).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role not found"})
		return
	}

	// Buat profile user baru
	userProfile := models.UserProfile{
		Username:     req.Username,
		Email:        req.Email,
		PhoneNumber:  req.PhoneNumber,
		IsCRMProfile: req.IsCRMProfile, // Ini jadi penentu CRM atau bukan
	}

	// Simpan ke dalam database
	if err := initializers.DB.Create(&userProfile).Error; err != nil {
		fmt.Println("Error creating user profile:", err) // Ini akan menampilkan detail error di terminal
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user profile"})
		return

	}

	// Buat UserAuth
	user := models.UserAuth{
		Username:      req.Username,
		Email:         req.Email,
		Password:      string(hashedPassword),
		UserProfileID: userProfile.ID,
		RoleID:        &role.ID,
	}

	if err := initializers.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	fmt.Println("Email received:", req.Email)

}

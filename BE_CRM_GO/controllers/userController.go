package controllers

import (
	"net/http"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
)

func GetAllUserProfiles(c *gin.Context) {
	var profiles []models.UserProfile

	if err := initializers.DB.Find(&profiles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user profiles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"profiles": profiles,
	})
}

func GetUserProfileByID(c *gin.Context) {
	id := c.Param("id")
	var profile models.UserProfile

	if err := initializers.DB.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"profile": profile,
	})
}

// Route yang hanya bisa diakses oleh CRM
func CRMOnlyDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome CRM!",
	})
}

func DeleteUserProfile(c *gin.Context) {
	id := c.Param("id")
	var profile models.UserProfile

	// Cari user terlebih dahulu
	if err := initializers.DB.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User profile not found"})
		return
	}

	// Hapus user secara total (hard delete)
	if err := initializers.DB.Unscoped().Delete(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User profile deleted permanently",
	})
}

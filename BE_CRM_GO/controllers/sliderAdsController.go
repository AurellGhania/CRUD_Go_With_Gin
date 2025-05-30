package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
)

const uploadPath = "assets/uploads/"

// Upload Slider Ads (single image)
func UploadAdsImages(c *gin.Context) {
	title := c.PostForm("title")
	categoryID := c.PostForm("category_id")
	description := c.PostForm("description") // optional
	terms := c.PostForm("terms")             // optional

	// Cek file gambar
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	// Buat folder jika belum ada
	if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload folder"})
		return
	}

	// Simpan gambar
	uniqueFileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	filePath := filepath.Join(uploadPath, uniqueFileName)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Validasi kategori
	var category models.Category
	if err := initializers.DB.First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
		return
	}

	// Simpan ke database
	ad := models.Ads{
		Title:       title,
		ImageURL:    filePath,
		Description: description,
		Terms:       terms,
		CategoryID:  category.ID,
	}

	if err := initializers.DB.Create(&ad).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save ads"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Ads uploaded successfully",
		"ad":      ad,
	})
}

// Ambil semua ads
func GetAllAds(c *gin.Context) {
	var ads []models.Ads
	if err := initializers.DB.Preload("Category").Find(&ads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve ads"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ads": ads})
}

// Ambil ads berdasarkan ID
func GetAdsByID(c *gin.Context) {
	id := c.Param("id")
	var ad models.Ads
	if err := initializers.DB.Preload("Category").First(&ad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}
	c.JSON(http.StatusOK, ad)
}

// Update ads
func UpdateAds(c *gin.Context) {
	id := c.Param("id")

	var ad models.Ads
	if err := initializers.DB.First(&ad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ads not found"})
		return
	}

	// Ambil data baru dari form
	newTitle := c.PostForm("title")
	newCategory := c.PostForm("category_id")
	newDescription := c.PostForm("description")
	newTerms := c.PostForm("terms")

	if newTitle != "" {
		ad.Title = newTitle
	}

	if newCategory != "" {
		var category models.Category
		if err := initializers.DB.First(&category, newCategory).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
			return
		}
		ad.CategoryID = category.ID
	}

	if newDescription != "" {
		ad.Description = newDescription
	}

	if newTerms != "" {
		ad.Terms = newTerms
	}

	// Jika ada gambar baru
	file, _ := c.FormFile("image")
	if file != nil {
		// Hapus gambar lama
		if ad.ImageURL != "" {
			os.Remove(ad.ImageURL)
		}

		uniqueFileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
		filePath := filepath.Join(uploadPath, uniqueFileName)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save new image"})
			return
		}
		ad.ImageURL = filePath
	}

	if err := initializers.DB.Save(&ad).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ads"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Ads updated",
		"ads":     ad,
	})
}

// Hapus ads
func DeleteAds(c *gin.Context) {
	id := c.Param("id")
	var ad models.Ads
	if err := initializers.DB.First(&ad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}

	// Hapus file gambar jika ada
	if ad.ImageURL != "" {
		os.Remove(ad.ImageURL)
	}

	if err := initializers.DB.Delete(&ad).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Ads"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ads deleted successfully"})
}

package controlllers

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
)

// UploadImages handles image uploads (either single or multiple)
func UploadImages(c *gin.Context) {
	// Get files from form input with name 'files' (note the plural)
	form, _ := c.MultipartForm()
	files := form.File["files"]

	// Check if files exist
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No files uploaded"})
		return
	}

	// Iterate through files
	for _, file := range files {
		// Validate file extension (only allow images)
		ext := filepath.Ext(file.Filename)
		if ext != ".jpg" && ext != ".png" && ext != ".jpeg" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid file type. Only JPG, PNG, and JPEG are allowed."})
			return
		}

		// Define path to save the file
		savePath := "./uploads/" + file.Filename
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			log.Println("Error saving file:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save file"})
			return
		}

		// Save file data to the database (if needed)
		image := models.Trying{
			ImageURL: savePath,
		}
		if err := initializers.DB.Create(&image).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save image to database"})
			return
		}
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("%d file(s) uploaded successfully", len(files)),
	})
}
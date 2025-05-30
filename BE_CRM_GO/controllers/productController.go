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

func GetProducts(c *gin.Context) {
	var products []models.Product
	if err := initializers.DB.Preload("Vouchers").Preload("Category").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	apiKey := c.PostForm("api_key")
	description := c.PostForm("description")
	price := c.PostForm("price")
	stock := c.PostForm("stock")
	categoryID := c.PostForm("category_id")

	var category models.Category
	if err := initializers.DB.First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get images"})
		return
	}

	files := form.File["images"]
	var uploadedImages []string

	for _, file := range files {
		imagePath := filepath.Join("assets", "uploads", fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename))
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		uploadedImages = append(uploadedImages, imagePath)
	}

	product := models.Product{
		Name:        name,
		ApiKey:      apiKey,
		Description: description,
		Price:       price,
		Stock:       stock,
		Images:      uploadedImages,
		CategoryID:  category.ID,
	}

	if err := initializers.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := initializers.DB.Preload("Vouchers").Preload("Category").First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := initializers.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	name := c.PostForm("name")
	apiKey := c.PostForm("api_key")
	description := c.PostForm("description")
	price := c.PostForm("price")
	stock := c.PostForm("stock")
	categoryID := c.PostForm("category_id")

	if categoryID != "" {
		var category models.Category
		if err := initializers.DB.First(&category, categoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
			return
		}
		product.CategoryID = category.ID
	}

	form, err := c.MultipartForm()
	var uploadedImages []string
	if err == nil && form != nil {
		files := form.File["images"]
		for _, file := range files {
			imagePath := filepath.Join("assets", "uploads", fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename))
			if err := c.SaveUploadedFile(file, imagePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
				return
			}
			uploadedImages = append(uploadedImages, imagePath)
		}
	}

	updates := map[string]interface{}{}
	if name != "" {
		updates["name"] = name
	}
	if apiKey != "" {
		updates["api_key"] = apiKey
	}
	if description != "" {
		updates["description"] = description
	}
	if price != "" {
		updates["price"] = price
	}
	if stock != "" {
		updates["stock"] = stock
	}
	if categoryID != "" {
		updates["category_id"] = product.CategoryID
	}
	if len(uploadedImages) > 0 {
		updates["images"] = uploadedImages
	}

	if len(updates) > 0 {
		if err := initializers.DB.Model(&product).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
			return
		}
	}

	if err := initializers.DB.Preload("Category").First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reload updated product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := initializers.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	for _, img := range product.Images {
		_ = os.Remove(img)
	}

	if err := initializers.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

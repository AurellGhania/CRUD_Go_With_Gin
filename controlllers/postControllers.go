package controlllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
)

func PostsCreate(c *gin.Context) {
	// Ambil input dari form-data
	title := c.PostForm("title")
	body := c.PostForm("body")

	// Ambil semua file gambar dari form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get images"})
		return
	}

	files := form.File["images"]

	var uploadedImages []string

	for _, file := range files {
		// Tentukan path untuk setiap gambar
		imagePath := filepath.Join("assets", "uploads", file.Filename)

		// Simpan file ke server
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		// Simpan path gambar yang berhasil di-upload ke dalam slice
		uploadedImages = append(uploadedImages, imagePath)
	}

	// Gabungkan semua path gambar menjadi satu string dengan koma
	joinedImages := strings.Join(uploadedImages, ",")

	// Simpan ke database (masukkan gambar-gambar ke dalam post)
	post := models.Trying{
		Title:    title,
		Body:     body,
		ImageURL: joinedImages, // Simpan sebagai string
	}

	// Masukkan post ke dalam database
	if err := initializers.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save post to database"})
		return
	}

	// Response sukses dengan daftar gambar yang berhasil di-upload
	c.JSON(http.StatusOK, gin.H{
		"message":    "Post created successfully",
		"image_urls": uploadedImages, // Mengirimkan daftar gambar yang terupload
	})
}

func PostsIndex(c *gin.Context) {
	//Get the Posts
	var posts []models.Trying
	initializers.DB.Find(&posts)

	//Respond them
	c.JSON(200, gin.H{
		"post": posts,
	})
}

func PostsShow(c *gin.Context) {
	//Get is from url
	id := c.Param("id")

	//Get the Posts
	var post models.Trying
	initializers.DB.First(&post, id)

	//Respond them
	c.JSON(200, gin.H{
		"posts": post,
	})
}

func PostsUpdate(c *gin.Context) {
	//Get id from url
	id := c.Param("id")

	//Get the data off req body
	var body struct {
		Body  string
		Title string // BELUM ADA IMAGE NYA TERNYATA
	}

	c.Bind(&body)

	//Find the post were updating
	var post models.Trying
	initializers.DB.First(&post, id)

	//update it
	initializers.DB.Model(&post).Updates(models.Trying{
		Title: body.Title,
		Body:  body.Body,
	},
	)

	//Respond with it
	c.JSON(200, gin.H{
		"posts": post,
	})
}

func PostsDelete(c *gin.Context) {
	//get the id off the url
	id := c.Param("id")
	fmt.Println(id)

	//delete the post
	//initializers.DB.Delete(&models.Post{}, id)
	initializers.DB.Where("id = ?", id).Delete(&models.Trying{})

	//respond
	c.Status(200)
}

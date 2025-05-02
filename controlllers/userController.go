package controlllers

import (
	"net/http"
	"os"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	// Get the email/pass from request body
	var body struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read request body",
		})
		return
	}

	// Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	// Create the user
	user := models.User{
		Name:     body.Name,
		Email:    body.Email,
		Password: string(hash),
	}

	result := initializers.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})
}

func Login(c *gin.Context) {
	// Get the email/pass from request body
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read request body",
		})
		return
	}

	// Lookup user by email
	var user models.User
	result := initializers.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil || user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// Compare provided password with hashed password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(), // expires in 30 days
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	// Send token back
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{})
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})
}

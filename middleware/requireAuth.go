package middleware

import (
	"net/http"
	"os"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// Get the cookie off req
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	// Decode/validate it
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Get the claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	// Check the expiration
	if float64(time.Now().Unix()) > claims["exp"].(float64) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
		return
	}

	// Find the user with token sub
	var user models.User
	initializers.DB.First(&user, claims["sub"])

	if user.ID == 0 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Attach to request
	c.Set("user", user)

	// Continue
	c.Next()
}

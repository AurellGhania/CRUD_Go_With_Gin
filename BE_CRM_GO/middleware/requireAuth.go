package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
		return
	}

	tokenString := parts[1]

	// Debug: check if SECRET is loaded
	secret := os.Getenv("SECRET")
	if secret == "" {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Server misconfiguration: SECRET is not set"})
		return
	}

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	exp, ok := claims["exp"].(float64)
	if !ok || float64(time.Now().Unix()) > exp {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired or invalid exp claim"})
		return
	}

	// Get user ID from "sub" claim
	idFloat, ok := claims["sub"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid sub claim"})
		return
	}
	userID := uint(idFloat)

	// Get user from DB
	var user models.UserAuth
	if err := initializers.DB.Preload("Role").First(&user, userID).Error; err != nil || user.ID == 0 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Optional: log user role
	fmt.Printf("Authenticated user: ID=%d, Role=%s\n", user.ID, user.Role.Name)

	// Attach user to context
	c.Set("user", user)
	c.Next()
}

func RequireCRM(c *gin.Context) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user, ok := userInterface.(models.UserAuth)
	if !ok || user.Role.Name != "crm" {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: CRM role required"})
		return
	}

	// Optional: log CRM access
	fmt.Println("CRM user accessing protected route")

	c.Next()
}

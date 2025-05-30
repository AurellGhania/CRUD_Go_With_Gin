package controllers

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// LogoutUser handles user logout by validating token from Authorization header
func LogoutUser(c *gin.Context) {
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

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userID := claims["sub"]
		role := claims["role"]

		c.JSON(http.StatusOK, gin.H{
			"message": "Logout successful",
			"user": gin.H{
				"id":   userID,
				"role": role,
			},
		})
		return
	}

	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Could not read token claims"})
}

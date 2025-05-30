package main

import (
	"log"
	"os"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/routes"
	"github.com/aurellghania/crud-golang/seeders"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to database
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()

	// Seed roles
	seeders.SeedRoles(initializers.DB)
}

func main() {
	router := gin.Default()

	// CORS config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // frontend URL kamu
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.Static("/assets", "./assets") // static files

	// Ensure uploads folder exists
	err := os.MkdirAll("./assets/uploads", os.ModePerm)
	if err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	// Register routes
	routes.SetupRoutes(router)

	// Get port from env or default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	// Listen on 0.0.0.0:<port> so bisa diakses dari luar
	address := "0.0.0.0:" + port
	log.Println("Server running on", address)

	err = router.Run(address)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

package main

import (
	"log"
	"net/http"

	"github.com/aurellghania/crud-golang/controlllers"
	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"os"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()

}

func main() {
	//load env variable

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//setup gin app
	router := gin.New()

	os.MkdirAll("./assets/uploads", os.ModePerm)

	router.Use(cors.Default())
	router.Static("/assets", "./assets")
	router.LoadHTMLGlob("templates/*")

	router.POST("/posts", controlllers.PostsCreate)
	router.POST("/posts/update/:id", controlllers.PostsUpdate)

	router.GET("/posts", controlllers.PostsIndex)
	router.GET("/posts/:id", controlllers.PostsShow)

	router.GET("/upload", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	router.POST("/upload", controlllers.PostsCreate)

	router.POST("/posts/delete/:id", controlllers.PostsDelete)

	// Auth
	router.POST("/signup", controlllers.Signup)
	router.POST("/login", controlllers.Login)
	router.GET("/validate", middleware.RequireAuth, controlllers.Validate)

	router.Run()

}

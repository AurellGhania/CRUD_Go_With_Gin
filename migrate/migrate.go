package main

import (
	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	//migrate otomatis
	//models nya dapet dari postModels.go, dibagian package models nya
	//initializers.DB.Migrator().DropTable(&models.Trying{}, &models.User{})

	//initializers.DB.Migrator().DropTable(&models.Trying{}, &models.User{})

	initializers.DB.AutoMigrate(&models.Trying{})
	initializers.DB.AutoMigrate(&models.User{})

}

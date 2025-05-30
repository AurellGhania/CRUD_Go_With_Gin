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

	initializers.DB.AutoMigrate(
		&models.Voucher{},
		&models.Product{},
		&models.Category{},
		&models.Ads{},
		&models.Role{},
		&models.UserAuth{},
		&models.UserProfile{},
		&models.OTP{},
	)
}

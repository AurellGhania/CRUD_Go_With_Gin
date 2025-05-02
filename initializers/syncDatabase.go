package initializers

import "github.com/aurellghania/crud-golang/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}

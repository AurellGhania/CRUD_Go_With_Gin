package seeders

import (
	"github.com/aurellghania/crud-golang/models"
	"gorm.io/gorm"
)

func SeedRoles(db *gorm.DB) {
	roles := []models.Role{
		{Name: "user"},
		{Name: "crm"},
	}

	for _, role := range roles {
		if err := db.Where("name = ?", role.Name).First(&role).Error; err != nil {
			if err := db.Create(&role).Error; err != nil {
				panic("failed to seed roles")
			}
		}
	}
}
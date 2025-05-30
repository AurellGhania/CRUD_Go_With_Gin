package models

import (
	"database/sql/driver"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

type Images []string

func (i *Images) Scan(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("failed to scan Images: %v", value)
	}
	if str == "" {
		*i = []string{}
		return nil
	}
	*i = strings.Split(str, ",")
	return nil
}

func (i Images) Value() (driver.Value, error) {
	return strings.Join(i, ","), nil
}

type Product struct {
	gorm.Model
	Name        string   `json:"name"`
	Description string   `json:"description"` // deskripsi produk
	Price       string   `json:"price"`       // harga produk
	Stock       string   `json:"stock"`       // jumlah stok produk
	Images      Images   `gorm:"type:text" json:"images"`
	ApiKey      string   `json:"api_key"`
	CategoryID  uint     `json:"category_id"`
	Category    Category `gorm:"foreignKey:CategoryID" json:"category"`

	Vouchers []Voucher `gorm:"many2many:voucher_has_products;" json:"vouchers"`
}

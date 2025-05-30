package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/aurellghania/crud-golang/initializers"
	"github.com/aurellghania/crud-golang/models"
	"github.com/gin-gonic/gin"
)

func GetVouchers(c *gin.Context) {
	var vouchers []models.Voucher
	if err := initializers.DB.Preload("Products").Find(&vouchers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, vouchers)
}

func generateVoucherCode() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var sb strings.Builder

	for i := 0; i < 16; i++ {
		sb.WriteByte(charset[rand.Intn(len(charset))])
		if (i+1)%4 == 0 && i != 15 {
			sb.WriteByte('-')
		}
	}
	return sb.String()
}

func CreateVoucher(c *gin.Context) {
	rand.Seed(time.Now().UnixNano())

	// Struktur input JSON
	var input struct {
		SalesID        uint      `json:"sales_id"`
		Duration       uint      `json:"duration"`
		Quantity       uint      `json:"quantity"`
		ExpiredVoucher time.Time `json:"expired_voucher"`
		ExpiredUse     time.Time `json:"expired_use"`
	}

	// Validasi input JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Slice penampung voucher yang akan disimpan
	var vouchers []models.Voucher

	for i := 0; i < int(input.Quantity); i++ {
		code := generateVoucherCode()

		// Pastikan kode voucher unik
		var existing models.Voucher
		if err := initializers.DB.Where("code = ?", code).First(&existing).Error; err == nil {
			i-- // ulangi kalau code sudah ada
			continue
		}

		voucher := models.Voucher{
			Code:           code,
			SalesID:        &input.SalesID,
			Duration:       input.Duration,
			ExpiredVoucher: input.ExpiredVoucher,
			ExpiredUse:     input.ExpiredUse,
		}

		vouchers = append(vouchers, voucher)
	}

	// Simpan semua voucher ke DB
	fmt.Println("Total vouchers generated:", len(vouchers))
	if err := initializers.DB.Create(&vouchers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vouchers"})
		return
	}

	// Kirim respon
	c.JSON(http.StatusCreated, vouchers)
}

func GetVoucherByID(c *gin.Context) {
	id := c.Param("id")
	var voucher models.Voucher
	if err := initializers.DB.Preload("Products").First(&voucher, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
		return
	}
	c.JSON(http.StatusOK, voucher)
}

func UpdateVoucher(c *gin.Context) {
	id := c.Param("id")
	var existing models.Voucher
	if err := initializers.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
		return
	}

	var input models.Voucher
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := initializers.DB.Model(&existing).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update voucher"})
		return
	}

	c.JSON(http.StatusOK, existing)
}

func DeleteVoucher(c *gin.Context) {
	id := c.Param("id")
	var voucher models.Voucher
	if err := initializers.DB.First(&voucher, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
		return
	}
	if err := initializers.DB.Delete(&voucher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete voucher"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Voucher deleted"})
}

func UpdateVoucherProducts(c *gin.Context) {
	voucherID := c.Param("id")

	var input struct {
		ProductIDs []uint `json:"product_ids"`
		Mode       string `json:"mode"` // "assign" or "unassign"
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var voucher models.Voucher
	if err := initializers.DB.Preload("Products").First(&voucher, voucherID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
		return
	}

	switch input.Mode {
	case "assign":
		var products []models.Product
		if err := initializers.DB.Where("id IN ?", input.ProductIDs).Find(&products).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find products"})
			return
		}
		if err := initializers.DB.Model(&voucher).Association("Products").Append(&products); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign products"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Products assigned successfully"})

	case "unassign":
		var products []models.Product
		if err := initializers.DB.Where("id IN ?", input.ProductIDs).Find(&products).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find products"})
			return
		}
		if err := initializers.DB.Model(&voucher).Association("Products").Delete(&products); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unassign products"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Products unassigned successfully"})

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mode, must be 'assign' or 'unassign'"})
	}
}

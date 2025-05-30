package routes

import (
	"github.com/aurellghania/crud-golang/controllers"
	"github.com/aurellghania/crud-golang/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	//Auth User
	auth := router.Group("/auth")
	{
		auth.POST("/send-otp", controllers.SendOtp)
		auth.POST("/verify-otp", controllers.VerifyOtp)
		auth.POST("/delete/:id", controllers.DeleteUserProfile)
		auth.POST("/register", controllers.RegisterUser)
		auth.POST("/login", controllers.LoginUser)
		auth.POST("/logout/:id", controllers.LogoutUser)
	}

	// Protected routes
	protected := router.Group("/api")
	{
		protected.Use(middleware.RequireAuth)

		protected.GET("/profile", controllers.GetAllUserProfiles)
		protected.GET("/profile/:id", controllers.GetUserProfileByID)
		protected.GET("/crm/dashboard", middleware.RequireCRM, controllers.CRMOnlyDashboard)
	}

	// Products
	products := router.Group("/products")
	{
		products.GET("/", controllers.GetProducts)
		products.POST("/", controllers.CreateProduct)
		products.GET("/:id", controllers.GetProductByID)
		products.POST("/update-product/:id", controllers.UpdateProduct)
		products.POST("/delete-product/:id", controllers.DeleteProduct)
	}

	// Vouchers
	vouchers := router.Group("/vouchers")
	{
		vouchers.GET("/", controllers.GetVouchers)
		vouchers.POST("/", controllers.CreateVoucher)
		vouchers.GET("/:id", controllers.GetVoucherByID)
		vouchers.POST("/update-voucher/:id", controllers.UpdateVoucher)
		vouchers.POST("/delete-voucher/:id", controllers.DeleteVoucher)

		//Assign and Unassign Voucher
		vouchers.POST("/:id/voucher-products", controllers.UpdateVoucherProducts)
	}

	//Category
	categories := router.Group("/categories")
	{
		categories.GET("/", controllers.GetCategories)
		categories.GET("/:id", controllers.GetCategoryByID)
		categories.POST("/", controllers.CreateCategory)
		categories.POST("update-category/:id", controllers.UpdateCategory)
		categories.POST("delete-category/:id", controllers.DeleteCategory)
	}

	//Banner or Slider Ads
	sliderAds := router.Group("/sliders")
	{
		sliderAds.POST("/upload", controllers.UploadAdsImages)
		sliderAds.GET("/ads", controllers.GetAllAds)
		sliderAds.GET("/ads/:id", controllers.GetAdsByID)
		sliderAds.POST("/update-ads/:id", controllers.UpdateAds)
		sliderAds.POST("/delete-ads/:id", controllers.DeleteAds)
	}

}

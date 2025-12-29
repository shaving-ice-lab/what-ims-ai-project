package routes

import (
	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"github.com/project/backend/handlers"
	"github.com/project/backend/middleware"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func RegisterRoutes(e *echo.Echo, db *gorm.DB, redis *redis.Client, logger *zap.Logger) {
	// API根路由
	api := e.Group("/api")
	
	// 健康检查
	api.GET("/health", handlers.HealthCheck)
	
	// 认证路由（无需登录）
	auth := api.Group("/auth")
	{
		auth.POST("/login", handlers.Login(db, logger))
		auth.POST("/refresh", handlers.RefreshToken(db, redis, logger))
		auth.POST("/logout", handlers.Logout(redis))
	}
	
	// 需要认证的路由
	// TODO: 从配置中获取JWT密钥
	jwtSecret := "your-secret-key-here"
	authenticated := api.Group("", middleware.AuthMiddleware(jwtSecret))
	
	// 管理员路由
	admin := authenticated.Group("/admin", middleware.RequireRole("admin", "sub_admin"))
	{
		// 管理员管理
		admin.GET("/admins", handlers.GetAdmins(db))
		admin.POST("/admins", handlers.CreateAdmin(db))
		admin.PUT("/admins/:id", handlers.UpdateAdmin(db))
		admin.DELETE("/admins/:id", handlers.DeleteAdmin(db))
		admin.PUT("/admins/:id/permissions", handlers.UpdatePermissions(db))
		
		// 供应商管理
		admin.GET("/suppliers", handlers.GetSuppliers(db))
		admin.POST("/suppliers", handlers.CreateSupplier(db))
		admin.PUT("/suppliers/:id", handlers.UpdateSupplier(db))
		admin.DELETE("/suppliers/:id", handlers.DeleteSupplier(db))
		
		// 门店管理
		admin.GET("/stores", handlers.GetStores(db))
		admin.POST("/stores", handlers.CreateStore(db))
		admin.PUT("/stores/:id", handlers.UpdateStore(db))
		admin.DELETE("/stores/:id", handlers.DeleteStore(db))
		
		// 物料管理
		admin.GET("/categories", handlers.GetCategories(db))
		admin.POST("/categories", handlers.CreateCategory(db))
		admin.PUT("/categories/:id", handlers.UpdateCategory(db))
		admin.DELETE("/categories/:id", handlers.DeleteCategory(db))
		
		admin.GET("/materials", handlers.GetMaterials(db))
		admin.POST("/materials", handlers.CreateMaterial(db))
		admin.PUT("/materials/:id", handlers.UpdateMaterial(db))
		admin.DELETE("/materials/:id", handlers.DeleteMaterial(db))
		
		admin.GET("/material-skus", handlers.GetMaterialSkus(db))
		admin.POST("/material-skus", handlers.CreateMaterialSku(db))
		admin.PUT("/material-skus/:id", handlers.UpdateMaterialSku(db))
		admin.DELETE("/material-skus/:id", handlers.DeleteMaterialSku(db))
		
		// 加价规则管理
		admin.GET("/price-markups", handlers.GetPriceMarkups(db))
		admin.POST("/price-markups", handlers.CreatePriceMarkup(db))
		admin.PUT("/price-markups/:id", handlers.UpdatePriceMarkup(db))
		admin.DELETE("/price-markups/:id", handlers.DeletePriceMarkup(db))
		
		// 订单管理
		admin.GET("/orders", handlers.GetOrdersAdmin(db))
		admin.GET("/orders/:id", handlers.GetOrderDetailAdmin(db))
		admin.PUT("/orders/:id/status", handlers.UpdateOrderStatusAdmin(db))
		
		// 系统配置
		admin.GET("/configs", handlers.GetSystemConfigs(db))
		admin.PUT("/configs", handlers.UpdateSystemConfig(db))
	}
	
	// 供应商路由
	supplier := authenticated.Group("/supplier", middleware.RequireRole("supplier"))
	{
		// 订单管理
		supplier.GET("/orders", handlers.GetOrdersSupplier(db))
		supplier.GET("/orders/:id", handlers.GetOrderDetailSupplier(db))
		supplier.PUT("/orders/:id/confirm", handlers.ConfirmOrder(db))
		supplier.PUT("/orders/:id/deliver", handlers.DeliverOrder(db))
		supplier.PUT("/orders/:id/complete", handlers.CompleteOrder(db))
		
		// 物料价格管理
		supplier.GET("/materials", handlers.GetSupplierMaterials(db))
		supplier.POST("/materials", handlers.CreateSupplierMaterial(db))
		supplier.PUT("/materials/:id", handlers.UpdateSupplierMaterial(db))
		supplier.DELETE("/materials/:id", handlers.DeleteSupplierMaterial(db))
		supplier.POST("/materials/import", handlers.ImportSupplierMaterials(db))
		
		// 配送设置
		supplier.GET("/delivery-settings", handlers.GetDeliverySettings(db))
		supplier.PUT("/delivery-settings", handlers.UpdateDeliverySettings(db))
		supplier.GET("/delivery-areas", handlers.GetDeliveryAreas(db))
		supplier.POST("/delivery-areas", handlers.CreateDeliveryArea(db))
		supplier.DELETE("/delivery-areas/:id", handlers.DeleteDeliveryArea(db))
		
		// 统计分析
		supplier.GET("/stats/overview", handlers.GetSupplierStats(db))
		supplier.GET("/stats/orders", handlers.GetSupplierOrderStats(db))
		supplier.GET("/stats/materials", handlers.GetSupplierMaterialStats(db))
	}
	
	// 门店路由
	store := authenticated.Group("/store", middleware.RequireRole("store"))
	{
		// 物料浏览
		store.GET("/materials", handlers.GetStoreMaterials(db))
		store.GET("/materials/:id", handlers.GetMaterialDetail(db))
		store.GET("/materials/:id/suppliers", handlers.GetMaterialSuppliers(db))
		
		// 购物车
		store.GET("/cart", handlers.GetCart(redis))
		store.POST("/cart", handlers.AddToCart(redis))
		store.PUT("/cart/:skuId", handlers.UpdateCartItem(redis))
		store.DELETE("/cart/:skuId", handlers.RemoveFromCart(redis))
		store.DELETE("/cart", handlers.ClearCart(redis))
		
		// 订单管理
		store.POST("/orders", handlers.CreateOrder(db, redis))
		store.GET("/orders", handlers.GetOrdersStore(db))
		store.GET("/orders/:id", handlers.GetOrderDetailStore(db))
		store.POST("/orders/:id/cancel", handlers.CancelOrder(db))
		store.POST("/orders/:id/reorder", handlers.ReorderItems(db, redis))
		
		// 支付
		store.POST("/payment/qrcode", handlers.GeneratePaymentQRCode(db))
		store.GET("/payment/:paymentNo/status", handlers.GetPaymentStatus(db))
		
		// 市场行情
		store.GET("/market/prices", handlers.GetMarketPrices(db))
		store.GET("/market/compare", handlers.ComparePrices(db))
		
		// 统计分析
		store.GET("/stats/overview", handlers.GetStoreStats(db))
		store.GET("/stats/orders", handlers.GetStoreOrderStats(db))
		store.GET("/stats/categories", handlers.GetStoreCategoryStats(db))
	}
	
	// 公共路由（需要登录但不限角色）
	authenticated.GET("/user/profile", handlers.GetUserProfile(db))
	authenticated.PUT("/user/profile", handlers.UpdateUserProfile(db))
	authenticated.PUT("/user/password", handlers.ChangePassword(db))
	authenticated.POST("/user/select-role", handlers.SelectRole(db, redis))
	authenticated.GET("/user/roles", handlers.GetUserRoles(db))
	
	// 文件上传
	authenticated.POST("/upload/image", handlers.UploadImage())
	authenticated.POST("/upload/excel", handlers.UploadExcel())
}

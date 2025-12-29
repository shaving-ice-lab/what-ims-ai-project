package routes

import (
	"github.com/labstack/echo/v4"
)

// MobileSupplierHandler 供应商端移动处理器接口
type MobileSupplierHandler interface {
	GetHomeData(c echo.Context) error
	GetOrderList(c echo.Context) error
	GetOrderDetail(c echo.Context) error
	ConfirmOrder(c echo.Context) error
	StartDelivery(c echo.Context) error
	CompleteOrder(c echo.Context) error
	GetProducts(c echo.Context) error
	UpdateProductPrice(c echo.Context) error
	UpdateProductStock(c echo.Context) error
	GetProfile(c echo.Context) error
	GetDeliverySettings(c echo.Context) error
}

// RegisterMobileSupplierRoutes 注册供应商端移动路由
func RegisterMobileSupplierRoutes(e *echo.Echo, h MobileSupplierHandler, authMiddleware echo.MiddlewareFunc) {
	supplierGroup := e.Group("/api/mobile/supplier")
	supplierGroup.Use(authMiddleware)
	{
		// 首页
		supplierGroup.GET("/home", h.GetHomeData)

		// 订单
		supplierGroup.GET("/orders", h.GetOrderList)
		supplierGroup.GET("/orders/:id", h.GetOrderDetail)
		supplierGroup.POST("/orders/:id/confirm", h.ConfirmOrder)
		supplierGroup.POST("/orders/:id/deliver", h.StartDelivery)
		supplierGroup.POST("/orders/:id/complete", h.CompleteOrder)

		// 物料价格
		supplierGroup.GET("/products", h.GetProducts)
		supplierGroup.PUT("/products/:id/price", h.UpdateProductPrice)
		supplierGroup.PUT("/products/:id/stock", h.UpdateProductStock)

		// 我的
		supplierGroup.GET("/profile", h.GetProfile)
		supplierGroup.GET("/delivery-settings", h.GetDeliverySettings)
	}
}

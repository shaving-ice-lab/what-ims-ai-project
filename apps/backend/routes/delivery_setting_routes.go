package routes

import (
	"github.com/labstack/echo/v4"
)

// DeliverySettingHandler 配送设置处理器接口
type DeliverySettingHandler interface {
	GetDeliverySetting(c echo.Context) error
	UpdateDeliverySetting(c echo.Context) error
	GetDeliveryAreas(c echo.Context) error
	AddDeliveryArea(c echo.Context) error
	BatchAddDeliveryAreas(c echo.Context) error
	DeleteDeliveryArea(c echo.Context) error
	GetWaybills(c echo.Context) error
	CreateWaybill(c echo.Context) error
	GetSupplierInfo(c echo.Context) error
	GetPendingAuditSettings(c echo.Context) error
	AuditDeliverySetting(c echo.Context) error
}

// RegisterDeliverySettingRoutes 注册配送设置路由
func RegisterDeliverySettingRoutes(e *echo.Echo, h DeliverySettingHandler, authMiddleware echo.MiddlewareFunc, supplierMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	// 供应商端配送设置
	supplierGroup := e.Group("/api/supplier")
	supplierGroup.Use(authMiddleware, supplierMiddleware)
	{
		// 配送设置
		supplierGroup.GET("/delivery-settings", h.GetDeliverySetting)
		supplierGroup.PUT("/delivery-settings", h.UpdateDeliverySetting)

		// 配送区域
		supplierGroup.GET("/delivery-areas", h.GetDeliveryAreas)
		supplierGroup.POST("/delivery-areas", h.AddDeliveryArea)
		supplierGroup.POST("/delivery-areas/batch", h.BatchAddDeliveryAreas)
		supplierGroup.DELETE("/delivery-areas/:id", h.DeleteDeliveryArea)

		// 运单管理
		supplierGroup.GET("/waybills", h.GetWaybills)
		supplierGroup.POST("/waybills", h.CreateWaybill)

		// 供应商信息
		supplierGroup.GET("/info", h.GetSupplierInfo)
	}

	// 管理员端配送设置审核
	adminGroup := e.Group("/api/admin/delivery-settings")
	adminGroup.Use(authMiddleware, adminMiddleware)
	{
		adminGroup.GET("/pending", h.GetPendingAuditSettings)
		adminGroup.POST("/:id/audit", h.AuditDeliverySetting)
	}
}

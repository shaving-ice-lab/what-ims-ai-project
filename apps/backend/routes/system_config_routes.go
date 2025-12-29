package routes

import (
	"github.com/labstack/echo/v4"
)

// SystemConfigHandler 系统配置处理器接口
type SystemConfigHandler interface {
	GetPaymentConfig(c echo.Context) error
	SavePaymentConfig(c echo.Context) error
	GetAPIConfig(c echo.Context) error
	SaveAPIConfig(c echo.Context) error
	GetOrderConfig(c echo.Context) error
	SaveOrderConfig(c echo.Context) error
	ListDeliveryNoteTemplates(c echo.Context) error
	CreateDeliveryNoteTemplate(c echo.Context) error
	UpdateDeliveryNoteTemplate(c echo.Context) error
	DeleteDeliveryNoteTemplate(c echo.Context) error
	PreviewDeliveryNoteTemplate(c echo.Context) error
	AssignTemplateToSupplier(c echo.Context) error
	GetOperationLogs(c echo.Context) error
	GetOperationLogDetail(c echo.Context) error
	ExportOperationLogs(c echo.Context) error
}

// RegisterSystemConfigRoutes 注册系统配置路由
func RegisterSystemConfigRoutes(e *echo.Echo, h SystemConfigHandler, authMiddleware echo.MiddlewareFunc, masterAdminMiddleware echo.MiddlewareFunc) {
	configGroup := e.Group("/api/admin/config")
	configGroup.Use(authMiddleware, masterAdminMiddleware)
	{
		// 支付配置
		configGroup.GET("/payment", h.GetPaymentConfig)
		configGroup.POST("/payment", h.SavePaymentConfig)

		// API配置
		configGroup.GET("/api", h.GetAPIConfig)
		configGroup.POST("/api", h.SaveAPIConfig)

		// 订单配置
		configGroup.GET("/order", h.GetOrderConfig)
		configGroup.POST("/order", h.SaveOrderConfig)

		// 送货单模板
		configGroup.GET("/delivery-templates", h.ListDeliveryNoteTemplates)
		configGroup.POST("/delivery-templates", h.CreateDeliveryNoteTemplate)
		configGroup.PUT("/delivery-templates/:id", h.UpdateDeliveryNoteTemplate)
		configGroup.DELETE("/delivery-templates/:id", h.DeleteDeliveryNoteTemplate)
		configGroup.GET("/delivery-templates/:id/preview", h.PreviewDeliveryNoteTemplate)
		configGroup.POST("/delivery-templates/assign", h.AssignTemplateToSupplier)
	}

	// 操作日志
	logGroup := e.Group("/api/admin/logs")
	logGroup.Use(authMiddleware)
	{
		logGroup.GET("/operation", h.GetOperationLogs)
		logGroup.GET("/operation/:id", h.GetOperationLogDetail)
		logGroup.GET("/operation/export", h.ExportOperationLogs)
	}
}

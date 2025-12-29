package routes

import (
	"github.com/labstack/echo/v4"
)

// AuditHandler 审核处理器接口
type AuditHandler interface {
	GetPendingAuditCounts(c echo.Context) error
	GetPendingDeliveryAudits(c echo.Context) error
	AuditDeliverySetting(c echo.Context) error
	GetPendingProductAudits(c echo.Context) error
	GetProductAuditDetail(c echo.Context) error
	AuditProduct(c echo.Context) error
	BatchAuditProducts(c echo.Context) error
	GetAuditHistory(c echo.Context) error
}

// RegisterAuditRoutes 注册审核路由
func RegisterAuditRoutes(e *echo.Echo, h AuditHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	auditGroup := e.Group("/api/admin/audits")
	auditGroup.Use(authMiddleware, adminMiddleware)
	{
		// 审核数量统计
		auditGroup.GET("/counts", h.GetPendingAuditCounts)

		// 配送设置审核
		auditGroup.GET("/delivery", h.GetPendingDeliveryAudits)
		auditGroup.POST("/delivery/:id", h.AuditDeliverySetting)

		// 产品审核
		auditGroup.GET("/products", h.GetPendingProductAudits)
		auditGroup.GET("/products/:id", h.GetProductAuditDetail)
		auditGroup.POST("/products/:id/audit", h.AuditProduct)
		auditGroup.POST("/products/batch", h.BatchAuditProducts)

		// 审核历史
		auditGroup.GET("/history", h.GetAuditHistory)
	}
}

package routes

import (
	"github.com/labstack/echo/v4"
)

// AdminDashboardHandler 管理员看板处理器接口
type AdminDashboardHandler interface {
	GetDashboardStats(c echo.Context) error
	GetOrderTrend(c echo.Context) error
	GetSupplierRanking(c echo.Context) error
	GetStoreRanking(c echo.Context) error
	GetOrderStatusStats(c echo.Context) error
	GetPendingCancelRequests(c echo.Context) error
	AuditCancelRequest(c echo.Context) error
	RestoreOrder(c echo.Context) error
	AdminCancelOrder(c echo.Context) error
	GetCancelledOrders(c echo.Context) error
}

// RegisterAdminDashboardRoutes 注册管理员看板路由
func RegisterAdminDashboardRoutes(e *echo.Echo, h AdminDashboardHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	// 管理员看板
	dashboardGroup := e.Group("/api/admin/dashboard")
	dashboardGroup.Use(authMiddleware, adminMiddleware)
	{
		dashboardGroup.GET("/stats", h.GetDashboardStats)
		dashboardGroup.GET("/order-trend", h.GetOrderTrend)
		dashboardGroup.GET("/supplier-ranking", h.GetSupplierRanking)
		dashboardGroup.GET("/store-ranking", h.GetStoreRanking)
		dashboardGroup.GET("/order-status", h.GetOrderStatusStats)
	}

	// 管理员订单管理
	orderGroup := e.Group("/api/admin/orders")
	orderGroup.Use(authMiddleware, adminMiddleware)
	{
		orderGroup.GET("/cancel-requests", h.GetPendingCancelRequests)
		orderGroup.POST("/cancel-requests/:id/audit", h.AuditCancelRequest)
		orderGroup.GET("/cancelled", h.GetCancelledOrders)
		orderGroup.POST("/:id/restore", h.RestoreOrder)
		orderGroup.POST("/:id/cancel", h.AdminCancelOrder)
	}
}

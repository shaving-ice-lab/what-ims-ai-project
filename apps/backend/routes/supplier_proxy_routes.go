package routes

import (
	"github.com/labstack/echo/v4"
)

// SupplierProxyHandler 供应商代管处理器接口
type SupplierProxyHandler interface {
	GetProxySuppliers(c echo.Context) error
	ProxySetMaterialPrice(c echo.Context) error
	ProxyBatchImportPrice(c echo.Context) error
	ProxySetDeliverySetting(c echo.Context) error
	ProxyAddDeliveryArea(c echo.Context) error
	ProxyConfirmOrder(c echo.Context) error
	ProxyUpdateOrderStatus(c echo.Context) error
	GetProxyOperationLogs(c echo.Context) error
}

// RegisterSupplierProxyRoutes 注册供应商代管路由
func RegisterSupplierProxyRoutes(e *echo.Echo, h SupplierProxyHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	proxyGroup := e.Group("/api/admin/proxy")
	proxyGroup.Use(authMiddleware, adminMiddleware)
	{
		// 代管供应商列表
		proxyGroup.GET("/suppliers", h.GetProxySuppliers)

		// 代管物料价格
		proxyGroup.POST("/suppliers/:supplierId/materials/price", h.ProxySetMaterialPrice)
		proxyGroup.POST("/suppliers/:supplierId/materials/import", h.ProxyBatchImportPrice)

		// 代管配送设置
		proxyGroup.POST("/suppliers/:supplierId/delivery", h.ProxySetDeliverySetting)
		proxyGroup.POST("/suppliers/:supplierId/delivery-areas", h.ProxyAddDeliveryArea)

		// 代管订单处理
		proxyGroup.POST("/suppliers/:supplierId/orders/:orderId/confirm", h.ProxyConfirmOrder)
		proxyGroup.PUT("/suppliers/:supplierId/orders/:orderId/status", h.ProxyUpdateOrderStatus)

		// 代管操作日志
		proxyGroup.GET("/suppliers/:supplierId/logs", h.GetProxyOperationLogs)
	}
}

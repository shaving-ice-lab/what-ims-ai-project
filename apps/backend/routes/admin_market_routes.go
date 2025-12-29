package routes

import (
	"github.com/labstack/echo/v4"
)

// AdminMarketHandler 管理员市场行情处理器接口
type AdminMarketHandler interface {
	GetMarketDashboard(c echo.Context) error
	GetPriceComparisons(c echo.Context) error
	GetSupplierPriceDetails(c echo.Context) error
	GetPriceAnomalies(c echo.Context) error
	GetExclusiveProducts(c echo.Context) error
	GetPriceTrend(c echo.Context) error
	ExportPriceComparisons(c echo.Context) error
}

// RegisterAdminMarketRoutes 注册管理员市场行情路由
func RegisterAdminMarketRoutes(e *echo.Echo, h AdminMarketHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	marketGroup := e.Group("/api/admin/market")
	marketGroup.Use(authMiddleware, adminMiddleware)
	{
		marketGroup.GET("/dashboard", h.GetMarketDashboard)
		marketGroup.GET("/price-comparisons", h.GetPriceComparisons)
		marketGroup.GET("/price-details/:materialSkuId", h.GetSupplierPriceDetails)
		marketGroup.GET("/price-anomalies", h.GetPriceAnomalies)
		marketGroup.GET("/exclusive-products", h.GetExclusiveProducts)
		marketGroup.GET("/price-trend/:materialSkuId", h.GetPriceTrend)
		marketGroup.GET("/export", h.ExportPriceComparisons)
	}
}

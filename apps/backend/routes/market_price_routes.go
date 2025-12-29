package routes

import (
	"github.com/labstack/echo/v4"
)

// MarketPriceHandler 市场行情处理器接口
type MarketPriceHandler interface {
	GetMarketOverview(c echo.Context) error
	GetPriceComparisons(c echo.Context) error
	GetPriceAdjustmentSuggestions(c echo.Context) error
	GetLowestPriceProducts(c echo.Context) error
	QuickAdjustPrice(c echo.Context) error
	RefreshMarketData(c echo.Context) error
}

// RegisterMarketPriceRoutes 注册市场行情路由
func RegisterMarketPriceRoutes(e *echo.Echo, h MarketPriceHandler, authMiddleware echo.MiddlewareFunc, supplierMiddleware echo.MiddlewareFunc) {
	// 供应商端市场行情
	supplierGroup := e.Group("/api/supplier/market-price")
	supplierGroup.Use(authMiddleware, supplierMiddleware)
	{
		supplierGroup.GET("/overview", h.GetMarketOverview)
		supplierGroup.GET("/comparisons", h.GetPriceComparisons)
		supplierGroup.GET("/suggestions", h.GetPriceAdjustmentSuggestions)
		supplierGroup.GET("/lowest", h.GetLowestPriceProducts)
		supplierGroup.POST("/quick-adjust", h.QuickAdjustPrice)
		supplierGroup.POST("/refresh", h.RefreshMarketData)
	}
}

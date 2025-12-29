package routes

import (
	"github.com/labstack/echo/v4"
)

// PriceMarkupHandler 加价规则处理器接口
type PriceMarkupHandler interface {
	Create(c echo.Context) error
	Update(c echo.Context) error
	Delete(c echo.Context) error
	GetByID(c echo.Context) error
	List(c echo.Context) error
	GetActiveRules(c echo.Context) error
	UpdateStatus(c echo.Context) error
	CalculateMarkup(c echo.Context) error
	StoreCalculateMarkup(c echo.Context) error
}

// RegisterPriceMarkupRoutes 注册加价规则路由
func RegisterPriceMarkupRoutes(e *echo.Echo, h PriceMarkupHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	// 管理员端加价规则管理
	adminGroup := e.Group("/api/admin/price-markups")
	adminGroup.Use(authMiddleware, adminMiddleware)
	{
		adminGroup.POST("", h.Create)
		adminGroup.GET("", h.List)
		adminGroup.GET("/active", h.GetActiveRules)
		adminGroup.POST("/calculate", h.CalculateMarkup)
		adminGroup.GET("/:id", h.GetByID)
		adminGroup.PUT("/:id", h.Update)
		adminGroup.DELETE("/:id", h.Delete)
		adminGroup.PUT("/:id/status", h.UpdateStatus)
	}

	// 门店端加价计算接口
	storeGroup := e.Group("/api/store/price-markups")
	storeGroup.Use(authMiddleware)
	{
		storeGroup.POST("/calculate", h.StoreCalculateMarkup)
	}
}

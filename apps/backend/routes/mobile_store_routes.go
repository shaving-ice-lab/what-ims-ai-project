package routes

import (
	"github.com/labstack/echo/v4"
)

// MobileStoreHandler 门店端移动处理器接口
type MobileStoreHandler interface {
	GetHomeData(c echo.Context) error
	GetCategories(c echo.Context) error
	SearchMaterials(c echo.Context) error
	GetMaterialDetail(c echo.Context) error
	GetCart(c echo.Context) error
	AddToCart(c echo.Context) error
	UpdateCartItem(c echo.Context) error
	RemoveCartItem(c echo.Context) error
	GetCheckoutPreview(c echo.Context) error
	SubmitOrder(c echo.Context) error
	GetOrderList(c echo.Context) error
	GetOrderDetail(c echo.Context) error
	CancelOrder(c echo.Context) error
	RequestCancelOrder(c echo.Context) error
	Reorder(c echo.Context) error
	GetMarketPrices(c echo.Context) error
	GetProfile(c echo.Context) error
	GetAddresses(c echo.Context) error
	GetFrequentItems(c echo.Context) error
	GetOrderStats(c echo.Context) error
}

// RegisterMobileStoreRoutes 注册门店端移动路由
func RegisterMobileStoreRoutes(e *echo.Echo, h MobileStoreHandler, authMiddleware echo.MiddlewareFunc) {
	storeGroup := e.Group("/api/mobile/store")
	storeGroup.Use(authMiddleware)
	{
		// 首页
		storeGroup.GET("/home", h.GetHomeData)
		storeGroup.GET("/categories", h.GetCategories)

		// 物料
		storeGroup.GET("/materials/search", h.SearchMaterials)
		storeGroup.GET("/materials/:id", h.GetMaterialDetail)

		// 购物车
		storeGroup.GET("/cart", h.GetCart)
		storeGroup.POST("/cart", h.AddToCart)
		storeGroup.PUT("/cart/:id", h.UpdateCartItem)
		storeGroup.DELETE("/cart/:id", h.RemoveCartItem)

		// 结算
		storeGroup.GET("/checkout/preview", h.GetCheckoutPreview)
		storeGroup.POST("/checkout/submit", h.SubmitOrder)

		// 订单
		storeGroup.GET("/orders", h.GetOrderList)
		storeGroup.GET("/orders/:id", h.GetOrderDetail)
		storeGroup.POST("/orders/:id/cancel", h.CancelOrder)
		storeGroup.POST("/orders/:id/request-cancel", h.RequestCancelOrder)
		storeGroup.POST("/orders/reorder", h.Reorder)

		// 市场行情
		storeGroup.GET("/market", h.GetMarketPrices)

		// 我的
		storeGroup.GET("/profile", h.GetProfile)
		storeGroup.GET("/addresses", h.GetAddresses)
		storeGroup.GET("/frequent-items", h.GetFrequentItems)
		storeGroup.GET("/stats", h.GetOrderStats)
	}
}

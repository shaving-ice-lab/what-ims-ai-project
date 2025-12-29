package routes

import (
	"github.com/labstack/echo/v4"
)

// PaymentHandler 支付处理器接口
type PaymentHandler interface {
	CreatePayment(c echo.Context) error
	GetPaymentStatus(c echo.Context) error
	RefreshQRCode(c echo.Context) error
	SwitchPaymentMethod(c echo.Context) error
	GetPaymentByOrder(c echo.Context) error
	PaymentCallback(c echo.Context) error
}

// RegisterPaymentRoutes 注册支付路由
func RegisterPaymentRoutes(e *echo.Echo, h PaymentHandler, authMiddleware echo.MiddlewareFunc) {
	// 门店端支付接口
	storeGroup := e.Group("/api/store/payments")
	storeGroup.Use(authMiddleware)
	{
		storeGroup.POST("", h.CreatePayment)
		storeGroup.GET("/:paymentNo/status", h.GetPaymentStatus)
		storeGroup.POST("/:paymentNo/refresh", h.RefreshQRCode)
		storeGroup.POST("/switch-method", h.SwitchPaymentMethod)
	}

	// 订单支付信息查询
	orderGroup := e.Group("/api/store/orders")
	orderGroup.Use(authMiddleware)
	{
		orderGroup.GET("/:orderId/payment", h.GetPaymentByOrder)
	}

	// 支付回调（无需认证）
	callbackGroup := e.Group("/api/payments/callback")
	{
		callbackGroup.POST("/wechat", h.PaymentCallback)
		callbackGroup.POST("/alipay", h.PaymentCallback)
	}
}

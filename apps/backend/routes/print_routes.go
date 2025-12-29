package routes

import (
	"github.com/labstack/echo/v4"
)

// PrintHandler 打印处理器接口
type PrintHandler interface {
	GetDeliveryNote(c echo.Context) error
	GetDeliveryNoteHTML(c echo.Context) error
	GetBatchDeliveryNotes(c echo.Context) error
	GetOrdersForPrint(c echo.Context) error
	MarkAsPrinted(c echo.Context) error
	GetPrintTemplate(c echo.Context) error
}

// RegisterPrintRoutes 注册打印路由
func RegisterPrintRoutes(e *echo.Echo, h PrintHandler, authMiddleware echo.MiddlewareFunc, supplierMiddleware echo.MiddlewareFunc) {
	// 供应商端打印接口
	supplierGroup := e.Group("/api/supplier/print")
	supplierGroup.Use(authMiddleware, supplierMiddleware)
	{
		supplierGroup.GET("/orders", h.GetOrdersForPrint)
		supplierGroup.GET("/delivery-note/:orderId", h.GetDeliveryNote)
		supplierGroup.GET("/delivery-note/:orderId/html", h.GetDeliveryNoteHTML)
		supplierGroup.POST("/delivery-notes/batch", h.GetBatchDeliveryNotes)
		supplierGroup.POST("/mark-printed", h.MarkAsPrinted)
		supplierGroup.GET("/template", h.GetPrintTemplate)
	}
}

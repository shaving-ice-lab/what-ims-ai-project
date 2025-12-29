package routes

import (
	"github.com/labstack/echo/v4"
)

// MarkupManagementHandler 加价管理处理器接口
type MarkupManagementHandler interface {
	GetMarkupOverview(c echo.Context) error
	SetGlobalSwitch(c echo.Context) error
	GetSupplierSwitches(c echo.Context) error
	SetSupplierSwitch(c echo.Context) error
	BatchSetSupplierSwitch(c echo.Context) error
	GetStoreSwitches(c echo.Context) error
	SetStoreSwitch(c echo.Context) error
	BatchSetStoreSwitch(c echo.Context) error
	GetCategorySwitches(c echo.Context) error
	SetCategorySwitch(c echo.Context) error
	GetMarkupRules(c echo.Context) error
	CreateMarkupRule(c echo.Context) error
	UpdateMarkupRule(c echo.Context) error
	DeleteMarkupRule(c echo.Context) error
	ToggleMarkupRule(c echo.Context) error
	ImportMarkupRules(c echo.Context) error
	DownloadImportTemplate(c echo.Context) error
}

// RegisterMarkupManagementRoutes 注册加价管理路由
func RegisterMarkupManagementRoutes(e *echo.Echo, h MarkupManagementHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	markupGroup := e.Group("/api/admin/markup")
	markupGroup.Use(authMiddleware, adminMiddleware)
	{
		// 加价概览
		markupGroup.GET("/overview", h.GetMarkupOverview)
		markupGroup.POST("/global-switch", h.SetGlobalSwitch)

		// 供应商加价开关
		markupGroup.GET("/switches/suppliers", h.GetSupplierSwitches)
		markupGroup.POST("/switches/suppliers/:id", h.SetSupplierSwitch)
		markupGroup.POST("/switches/suppliers/batch", h.BatchSetSupplierSwitch)

		// 门店加价开关
		markupGroup.GET("/switches/stores", h.GetStoreSwitches)
		markupGroup.POST("/switches/stores/:id", h.SetStoreSwitch)
		markupGroup.POST("/switches/stores/batch", h.BatchSetStoreSwitch)

		// 分类加价开关
		markupGroup.GET("/switches/categories", h.GetCategorySwitches)
		markupGroup.POST("/switches/categories/:id", h.SetCategorySwitch)

		// 加价规则
		markupGroup.GET("/rules", h.GetMarkupRules)
		markupGroup.POST("/rules", h.CreateMarkupRule)
		markupGroup.PUT("/rules/:id", h.UpdateMarkupRule)
		markupGroup.DELETE("/rules/:id", h.DeleteMarkupRule)
		markupGroup.POST("/rules/:id/toggle", h.ToggleMarkupRule)
		markupGroup.POST("/rules/import", h.ImportMarkupRules)
		markupGroup.GET("/rules/template", h.DownloadImportTemplate)
	}
}

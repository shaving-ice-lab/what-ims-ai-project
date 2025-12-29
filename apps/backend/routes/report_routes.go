package routes

import (
	"github.com/labstack/echo/v4"
)

// ReportHandler 报表处理器接口
type ReportHandler interface {
	GetStoreReports(c echo.Context) error
	GetStoreDetail(c echo.Context) error
	GetSupplierReports(c echo.Context) error
	GetSupplierDetail(c echo.Context) error
	GetMaterialReports(c echo.Context) error
	GetComparisonData(c echo.Context) error
	GetRankingChanges(c echo.Context) error
	ExportStoreReports(c echo.Context) error
	ExportSupplierReports(c echo.Context) error
	ExportMaterialReports(c echo.Context) error
}

// RegisterReportRoutes 注册报表路由
func RegisterReportRoutes(e *echo.Echo, h ReportHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	reportGroup := e.Group("/api/admin/reports")
	reportGroup.Use(authMiddleware, adminMiddleware)
	{
		// 门店报表
		reportGroup.GET("/stores", h.GetStoreReports)
		reportGroup.GET("/stores/export", h.ExportStoreReports)
		reportGroup.GET("/stores/:storeId", h.GetStoreDetail)

		// 供应商报表
		reportGroup.GET("/suppliers", h.GetSupplierReports)
		reportGroup.GET("/suppliers/export", h.ExportSupplierReports)
		reportGroup.GET("/suppliers/:supplierId", h.GetSupplierDetail)

		// 物料报表
		reportGroup.GET("/materials", h.GetMaterialReports)
		reportGroup.GET("/materials/export", h.ExportMaterialReports)

		// 对比分析
		reportGroup.GET("/comparison", h.GetComparisonData)
		reportGroup.GET("/ranking-changes", h.GetRankingChanges)
	}
}

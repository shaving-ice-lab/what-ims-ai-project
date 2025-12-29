package routes

import (
	"github.com/labstack/echo/v4"
)

// AssetHandler 素材库处理器接口
type AssetHandler interface {
	ListAssets(c echo.Context) error
	UploadAsset(c echo.Context) error
	BatchUploadAssets(c echo.Context) error
	UpdateAsset(c echo.Context) error
	DeleteAsset(c echo.Context) error
	GetAssetUsageStats(c echo.Context) error
	GetMatchConfig(c echo.Context) error
	SaveMatchConfig(c echo.Context) error
	MatchImageForProduct(c echo.Context) error
	BatchMatchImages(c echo.Context) error
	ApplyImageMatch(c echo.Context) error
	GetMatchHistory(c echo.Context) error
}

// RegisterAssetRoutes 注册素材库路由
func RegisterAssetRoutes(e *echo.Echo, h AssetHandler, authMiddleware echo.MiddlewareFunc, adminMiddleware echo.MiddlewareFunc) {
	assetGroup := e.Group("/api/admin/assets")
	assetGroup.Use(authMiddleware, adminMiddleware)
	{
		// 素材管理
		assetGroup.GET("", h.ListAssets)
		assetGroup.POST("", h.UploadAsset)
		assetGroup.POST("/batch", h.BatchUploadAssets)
		assetGroup.PUT("/:id", h.UpdateAsset)
		assetGroup.DELETE("/:id", h.DeleteAsset)
		assetGroup.GET("/:id/usage", h.GetAssetUsageStats)

		// 图片匹配
		assetGroup.GET("/match-config", h.GetMatchConfig)
		assetGroup.POST("/match-config", h.SaveMatchConfig)
		assetGroup.GET("/match/:materialSkuId", h.MatchImageForProduct)
		assetGroup.POST("/match/batch", h.BatchMatchImages)
		assetGroup.POST("/match/apply", h.ApplyImageMatch)
		assetGroup.GET("/match/history", h.GetMatchHistory)
	}
}

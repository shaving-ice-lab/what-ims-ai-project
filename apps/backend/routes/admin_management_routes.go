package routes

import (
	"github.com/labstack/echo/v4"
)

// AdminManagementHandler 管理员管理处理器接口
type AdminManagementHandler interface {
	ListAdmins(c echo.Context) error
	GetAdminDetail(c echo.Context) error
	CreateSubAdmin(c echo.Context) error
	UpdateSubAdmin(c echo.Context) error
	ResetAdminPassword(c echo.Context) error
	ToggleAdminStatus(c echo.Context) error
	GetAllPermissions(c echo.Context) error
}

// RegisterAdminManagementRoutes 注册管理员管理路由
func RegisterAdminManagementRoutes(e *echo.Echo, h AdminManagementHandler, authMiddleware echo.MiddlewareFunc, masterAdminMiddleware echo.MiddlewareFunc) {
	adminGroup := e.Group("/api/admin/admins")
	adminGroup.Use(authMiddleware, masterAdminMiddleware)
	{
		adminGroup.GET("", h.ListAdmins)
		adminGroup.GET("/:id", h.GetAdminDetail)
		adminGroup.POST("", h.CreateSubAdmin)
		adminGroup.PUT("/:id", h.UpdateSubAdmin)
		adminGroup.POST("/:id/reset-password", h.ResetAdminPassword)
		adminGroup.POST("/:id/toggle", h.ToggleAdminStatus)
	}

	// 权限列表（仅需认证）
	e.GET("/api/admin/permissions", h.GetAllPermissions, authMiddleware)
}

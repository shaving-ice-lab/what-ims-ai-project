package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// SuccessResponse 成功响应
func SuccessResponse(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "success",
		"data":    data,
	})
}

// ErrorResponse 错误响应
func ErrorResponse(c echo.Context, code int, message string) error {
	return c.JSON(code, map[string]interface{}{
		"code":    code,
		"message": message,
		"data":    nil,
	})
}

// PagedResponse 分页响应
func PagedResponse(c echo.Context, items interface{}, total int64, page, pageSize int) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "success",
		"data": map[string]interface{}{
			"items":    items,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

// GetPagination 获取分页参数
func GetPagination(c echo.Context) (page int, pageSize int) {
	page, _ = strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	
	pageSize, _ = strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	
	return page, pageSize
}

// GetUserID 从context获取用户ID
func GetUserID(c echo.Context) uint {
	if id, ok := c.Get("user_id").(uint); ok {
		return id
	}
	return 0
}

// GetUserRole 从context获取用户角色
func GetUserRole(c echo.Context) string {
	if role, ok := c.Get("role").(string); ok {
		return role
	}
	return ""
}

// GetRoleID 从context获取角色ID
func GetRoleID(c echo.Context) uint {
	if id, ok := c.Get("role_id").(uint); ok {
		return id
	}
	return 0
}

// HealthCheck 健康检查
func HealthCheck(c echo.Context) error {
	return SuccessResponse(c, map[string]string{
		"status": "healthy",
	})
}

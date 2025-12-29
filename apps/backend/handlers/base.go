package handlers

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

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

// HealthCheck 健康检查
func HealthCheck(c echo.Context) error {
	return SuccessResponse(c, map[string]string{
		"status": "healthy",
	})
}

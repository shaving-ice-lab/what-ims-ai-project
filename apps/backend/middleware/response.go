package middleware

import (
	"github.com/labstack/echo/v4"
	"golang.org/x/time/rate"
)

// ResponseFormatter 统一响应格式中间件
func ResponseFormatter() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 执行业务逻辑
			err := next(c)
			
			// 如果已经写入响应，直接返回
			if c.Response().Committed {
				return err
			}
			
			// 处理错误响应
			if err != nil {
				if he, ok := err.(*echo.HTTPError); ok {
					return c.JSON(he.Code, map[string]interface{}{
						"code":    he.Code,
						"message": he.Message,
						"data":    nil,
					})
				}
				return c.JSON(500, map[string]interface{}{
					"code":    500,
					"message": err.Error(),
					"data":    nil,
				})
			}
			
			return err
		}
	}
}

// RateLimiter 速率限制中间件
func RateLimiter() echo.MiddlewareFunc {
	// 创建一个每秒100个请求的限制器
	limiter := rate.NewLimiter(100, 200)
	
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if !limiter.Allow() {
				return c.JSON(429, map[string]interface{}{
					"code":    429,
					"message": "请求过于频繁，请稍后再试",
				})
			}
			return next(c)
		}
	}
}

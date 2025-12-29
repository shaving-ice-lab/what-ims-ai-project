package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type JWTClaims struct {
	UserID    uint   `json:"user_id"`
	Role      string `json:"role"`
	RoleID    uint   `json:"role_id,omitempty"`
	SessionID string `json:"session_id"`
	jwt.RegisteredClaims
}

// AuthMiddleware JWT认证中间件
func AuthMiddleware(secret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 获取token
			tokenString := extractToken(c)
			if tokenString == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "未授权访问",
				})
			}

			// 解析token
			token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(secret), nil
			})

			if err != nil || !token.Valid {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "Token无效或已过期",
				})
			}

			// 将用户信息存入context
			if claims, ok := token.Claims.(*JWTClaims); ok {
				c.Set("user_id", claims.UserID)
				c.Set("role", claims.Role)
				c.Set("role_id", claims.RoleID)
				c.Set("session_id", claims.SessionID)
			}

			return next(c)
		}
	}
}

// RequireRole 角色权限中间件
func RequireRole(roles ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userRole := c.Get("role").(string)
			
			for _, role := range roles {
				if userRole == role {
					return next(c)
				}
			}
			
			return c.JSON(http.StatusForbidden, map[string]interface{}{
				"code":    403,
				"message": "无权访问该资源",
			})
		}
	}
}

// RequirePermission 权限检查中间件
func RequirePermission(permission string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userRole := c.Get("role").(string)
			
			// 管理员需要检查具体权限
			if userRole == "admin" || userRole == "sub_admin" {
				// TODO: 从数据库查询用户权限并验证
				// 这里需要注入数据库连接来查询权限
				return next(c)
			}
			
			// 其他角色默认无权限
			return c.JSON(http.StatusForbidden, map[string]interface{}{
				"code":    403,
				"message": "无权访问该资源",
			})
		}
	}
}

// GenerateToken 生成JWT token
func GenerateToken(userID uint, role string, roleID uint, sessionID string, secret string, expiry time.Duration) (string, error) {
	claims := JWTClaims{
		UserID:    userID,
		Role:      role,
		RoleID:    roleID,
		SessionID: sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// extractToken 从请求中提取token
func extractToken(c echo.Context) string {
	// 从Header中获取
	bearerToken := c.Request().Header.Get("Authorization")
	if bearerToken != "" {
		parts := strings.Split(bearerToken, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			return parts[1]
		}
	}
	
	// 从Query参数获取
	token := c.QueryParam("token")
	if token != "" {
		return token
	}
	
	// 从Cookie获取
	cookie, err := c.Cookie("token")
	if err == nil {
		return cookie.Value
	}
	
	return ""
}

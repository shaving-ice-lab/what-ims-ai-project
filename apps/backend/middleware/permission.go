package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// Permission 权限常量
type Permission string

const (
	// 普通权限（可分配给子管理员）
	PermOrder        Permission = "order"         // 订单管理
	PermReport       Permission = "report"        // 数据报表
	PermSupplier     Permission = "supplier"      // 供应商管理
	PermStore        Permission = "store"         // 门店管理
	PermMaterial     Permission = "material"      // 物料管理
	PermMedia        Permission = "media"         // 素材库
	PermProductAudit Permission = "product_audit" // 产品审核
	PermMarkup       Permission = "markup"        // 加价管理
	PermDeliveryAudit Permission = "delivery_audit" // 配送设置审核
	PermWebhook      Permission = "webhook"       // Webhook配置

	// 敏感权限（仅主管理员）
	PermPaymentConfig Permission = "payment_config" // 支付配置
	PermAPIConfig     Permission = "api_config"     // API配置
	PermSystemConfig  Permission = "system_config"  // 系统设置
	PermAdminManage   Permission = "admin_manage"   // 管理员管理
)

// SensitivePermissions 敏感权限列表
var SensitivePermissions = []Permission{
	PermPaymentConfig,
	PermAPIConfig,
	PermSystemConfig,
	PermAdminManage,
}

// PermissionDescriptions 权限描述映射
var PermissionDescriptions = map[Permission]string{
	PermOrder:         "订单管理",
	PermReport:        "数据报表",
	PermSupplier:      "供应商管理",
	PermStore:         "门店管理",
	PermMaterial:      "物料管理",
	PermMedia:         "素材库",
	PermProductAudit:  "产品审核",
	PermMarkup:        "加价管理",
	PermDeliveryAudit: "配送设置审核",
	PermWebhook:       "Webhook配置",
	PermPaymentConfig: "支付配置",
	PermAPIConfig:     "API配置",
	PermSystemConfig:  "系统设置",
	PermAdminManage:   "管理员管理",
}

// AllPermissions 所有权限列表
var AllPermissions = []Permission{
	PermOrder, PermReport, PermSupplier, PermStore, PermMaterial,
	PermMedia, PermProductAudit, PermMarkup, PermDeliveryAudit, PermWebhook,
	PermPaymentConfig, PermAPIConfig, PermSystemConfig, PermAdminManage,
}

// NormalPermissions 普通权限列表（可分配给子管理员）
var NormalPermissions = []Permission{
	PermOrder, PermReport, PermSupplier, PermStore, PermMaterial,
	PermMedia, PermProductAudit, PermMarkup, PermDeliveryAudit, PermWebhook,
}

// UserRole 用户角色
type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleSubAdmin UserRole = "sub_admin"
	RoleSupplier UserRole = "supplier"
	RoleStore    UserRole = "store"
)

// UserClaims JWT用户声明
type UserClaims struct {
	UserID      uint64     `json:"userId"`
	Username    string     `json:"username"`
	Role        UserRole   `json:"role"`
	IsPrimary   bool       `json:"isPrimary"`
	Permissions []string   `json:"permissions"`
}

// IsSensitivePermission 判断是否为敏感权限
func IsSensitivePermission(perm Permission) bool {
	for _, p := range SensitivePermissions {
		if p == perm {
			return true
		}
	}
	return false
}

// RequirePermission 权限校验中间件
func RequirePermission(permission Permission) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims, ok := c.Get("user").(*UserClaims)
			if !ok || claims == nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "未登录或登录已过期",
				})
			}

			// 检查角色权限
			if !hasPermission(claims, permission) {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"code":    403,
					"message": "无权限访问此资源",
				})
			}

			return next(c)
		}
	}
}

// RequireRole 角色校验中间件
func RequireRole(roles ...UserRole) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims, ok := c.Get("user").(*UserClaims)
			if !ok || claims == nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "未登录或登录已过期",
				})
			}

			// 检查角色
			for _, role := range roles {
				if claims.Role == role {
					return next(c)
				}
			}

			return c.JSON(http.StatusForbidden, map[string]interface{}{
				"code":    403,
				"message": "角色权限不足",
			})
		}
	}
}

// RequireAdmin 需要管理员角色
func RequireAdmin() echo.MiddlewareFunc {
	return RequireRole(RoleAdmin, RoleSubAdmin)
}

// RequirePrimaryAdmin 需要主管理员
func RequirePrimaryAdmin() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims, ok := c.Get("user").(*UserClaims)
			if !ok || claims == nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "未登录或登录已过期",
				})
			}

			if claims.Role != RoleAdmin || !claims.IsPrimary {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"code":    403,
					"message": "需要主管理员权限",
				})
			}

			return next(c)
		}
	}
}

// hasPermission 检查用户是否有指定权限
func hasPermission(claims *UserClaims, permission Permission) bool {
	// 主管理员拥有所有权限
	if claims.Role == RoleAdmin && claims.IsPrimary {
		return true
	}

	// 敏感权限仅主管理员可访问
	if IsSensitivePermission(permission) {
		return claims.Role == RoleAdmin && claims.IsPrimary
	}

	// 子管理员检查权限列表
	if claims.Role == RoleSubAdmin {
		for _, p := range claims.Permissions {
			if Permission(p) == permission {
				return true
			}
		}
		return false
	}

	// 供应商和门店的权限由路由控制，这里返回true
	// 具体的数据权限在业务层控制
	return true
}

// GetUserClaims 从上下文获取用户信息
func GetUserClaims(c echo.Context) *UserClaims {
	claims, ok := c.Get("user").(*UserClaims)
	if !ok {
		return nil
	}
	return claims
}

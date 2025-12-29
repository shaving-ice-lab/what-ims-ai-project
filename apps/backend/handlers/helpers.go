package handlers

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// Response represents standard API response
type Response struct {
	Code      int         `json:"code"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// PageResponse represents paginated response
type PageResponse struct {
	Code      int         `json:"code"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
	Total     int64       `json:"total"`
	Page      int         `json:"page"`
	PageSize  int         `json:"pageSize"`
	Timestamp int64       `json:"timestamp"`
}

// SuccessResponse returns a success response
func SuccessResponse(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, Response{
		Code:      0,
		Message:   "success",
		Data:      data,
		Timestamp: time.Now().Unix(),
	})
}

// SuccessPageResponse returns a paginated success response
func SuccessPageResponse(c echo.Context, data interface{}, total int64, page, pageSize int) error {
	return c.JSON(http.StatusOK, PageResponse{
		Code:      0,
		Message:   "success",
		Data:      data,
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		Timestamp: time.Now().Unix(),
	})
}

// ErrorResponse returns an error response
func ErrorResponse(c echo.Context, code int, message string) error {
	return c.JSON(code, Response{
		Code:      code,
		Message:   message,
		Timestamp: time.Now().Unix(),
	})
}

// GetUserID retrieves user ID from context
func GetUserID(c echo.Context) uint64 {
	if userID, ok := c.Get("user_id").(uint); ok {
		return uint64(userID)
	}
	if userID, ok := c.Get("user_id").(uint64); ok {
		return userID
	}
	return 0
}

// GetUserRole retrieves user role from context
func GetUserRole(c echo.Context) string {
	if role, ok := c.Get("role").(string); ok {
		return role
	}
	return ""
}

// GetSupplierID retrieves supplier ID from context
func GetSupplierID(c echo.Context) uint64 {
	role := GetUserRole(c)
	if role != "supplier" {
		return 0
	}
	if supplierID, ok := c.Get("role_id").(uint); ok {
		return uint64(supplierID)
	}
	if supplierID, ok := c.Get("role_id").(uint64); ok {
		return supplierID
	}
	return 0
}

// GetStoreID retrieves store ID from context
func GetStoreID(c echo.Context) uint64 {
	role := GetUserRole(c)
	if role != "store" {
		return 0
	}
	if storeID, ok := c.Get("role_id").(uint); ok {
		return uint64(storeID)
	}
	if storeID, ok := c.Get("role_id").(uint64); ok {
		return storeID
	}
	return 0
}

// GetAdminID retrieves admin ID from context
func GetAdminID(c echo.Context) uint64 {
	role := GetUserRole(c)
	if role != "admin" && role != "sub_admin" {
		return 0
	}
	if adminID, ok := c.Get("role_id").(uint); ok {
		return uint64(adminID)
	}
	if adminID, ok := c.Get("role_id").(uint64); ok {
		return adminID
	}
	return 0
}

// IsAdmin checks if user is admin or sub_admin
func IsAdmin(c echo.Context) bool {
	role := GetUserRole(c)
	return role == "admin" || role == "sub_admin"
}

// IsSupplier checks if user is supplier
func IsSupplier(c echo.Context) bool {
	return GetUserRole(c) == "supplier"
}

// IsStore checks if user is store
func IsStore(c echo.Context) bool {
	return GetUserRole(c) == "store"
}

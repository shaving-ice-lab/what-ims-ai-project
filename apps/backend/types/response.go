package types

import "time"

// ApiResponse 统一API响应结构
type ApiResponse struct {
	Code      int         `json:"code"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// PaginationQuery 分页请求参数
type PaginationQuery struct {
	Page     int `json:"page" query:"page" validate:"min=1"`
	PageSize int `json:"pageSize" query:"pageSize" validate:"min=1,max=100"`
}

// PaginatedResponse 分页响应结构
type PaginatedResponse struct {
	Items    interface{} `json:"items"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"pageSize"`
}

// NewApiResponse 创建成功响应
func NewApiResponse(data interface{}) *ApiResponse {
	return &ApiResponse{
		Code:      0,
		Message:   "success",
		Data:      data,
		Timestamp: time.Now().Unix(),
	}
}

// NewApiError 创建错误响应
func NewApiError(code int, message string) *ApiResponse {
	return &ApiResponse{
		Code:      code,
		Message:   message,
		Timestamp: time.Now().Unix(),
	}
}

// NewPaginatedResponse 创建分页响应
func NewPaginatedResponse(items interface{}, total int64, page, pageSize int) *PaginatedResponse {
	return &PaginatedResponse{
		Items:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}
}

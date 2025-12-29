package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"time"

	"github.com/labstack/echo/v4"
)

// OperationLogEntry 操作日志条目
type OperationLogEntry struct {
	UserID      uint64                 `json:"userId"`
	UserType    string                 `json:"userType"`
	UserName    string                 `json:"userName"`
	Module      string                 `json:"module"`
	Action      string                 `json:"action"`
	TargetType  string                 `json:"targetType"`
	TargetID    uint64                 `json:"targetId,omitempty"`
	Description string                 `json:"description"`
	RequestPath string                 `json:"requestPath"`
	Method      string                 `json:"method"`
	RequestBody map[string]interface{} `json:"requestBody,omitempty"`
	ResponseCode int                   `json:"responseCode"`
	IP          string                 `json:"ip"`
	UserAgent   string                 `json:"userAgent"`
	Duration    int64                  `json:"duration"` // 毫秒
	CreatedAt   time.Time              `json:"createdAt"`
}

// OperationLogConfig 操作日志配置
type OperationLogConfig struct {
	Module      string
	Action      string
	TargetType  string
	Description string
	SkipPaths   []string
	LogHandler  func(entry *OperationLogEntry) error
}

// OperationLogMiddleware 操作日志中间件
func OperationLogMiddleware(config OperationLogConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 检查是否跳过
			path := c.Request().URL.Path
			for _, skip := range config.SkipPaths {
				if path == skip {
					return next(c)
				}
			}

			startTime := time.Now()

			// 读取请求体
			var requestBody map[string]interface{}
			if c.Request().Body != nil {
				bodyBytes, _ := io.ReadAll(c.Request().Body)
				c.Request().Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
				if len(bodyBytes) > 0 {
					json.Unmarshal(bodyBytes, &requestBody)
				}
			}

			// 执行请求
			err := next(c)

			// 获取用户信息
			var userID uint64
			var userType, userName string
			if claims := GetUserClaims(c); claims != nil {
				userID = claims.UserID
				userType = string(claims.Role)
				userName = claims.Username
			}

			// 创建日志条目
			entry := &OperationLogEntry{
				UserID:       userID,
				UserType:     userType,
				UserName:     userName,
				Module:       config.Module,
				Action:       config.Action,
				TargetType:   config.TargetType,
				Description:  config.Description,
				RequestPath:  path,
				Method:       c.Request().Method,
				RequestBody:  sanitizeRequestBody(requestBody),
				ResponseCode: c.Response().Status,
				IP:           c.RealIP(),
				UserAgent:    c.Request().UserAgent(),
				Duration:     time.Since(startTime).Milliseconds(),
				CreatedAt:    time.Now(),
			}

			// 尝试从路径参数获取目标ID
			if id := c.Param("id"); id != "" {
				// 简单的字符串转数字，忽略错误
				var targetID uint64
				json.Unmarshal([]byte(id), &targetID)
				entry.TargetID = targetID
			}

			// 异步记录日志
			if config.LogHandler != nil {
				go config.LogHandler(entry)
			}

			return err
		}
	}
}

// sanitizeRequestBody 清理请求体中的敏感信息
func sanitizeRequestBody(body map[string]interface{}) map[string]interface{} {
	if body == nil {
		return nil
	}

	sensitiveFields := []string{
		"password", "oldPassword", "newPassword", "confirmPassword",
		"apiKey", "apiSecret", "secretKey", "token", "refreshToken",
		"cardNo", "cvv", "expiry",
	}

	result := make(map[string]interface{})
	for k, v := range body {
		isSensitive := false
		for _, field := range sensitiveFields {
			if k == field {
				isSensitive = true
				break
			}
		}
		if isSensitive {
			result[k] = "******"
		} else {
			result[k] = v
		}
	}
	return result
}

// AuditLogEntry 审计日志条目（敏感操作）
type AuditLogEntry struct {
	OperationLogEntry
	OldData     map[string]interface{} `json:"oldData,omitempty"`
	NewData     map[string]interface{} `json:"newData,omitempty"`
	ChangeFields []string              `json:"changeFields,omitempty"`
	Reason      string                 `json:"reason,omitempty"`
}

// AuditLogConfig 审计日志配置
type AuditLogConfig struct {
	OperationLogConfig
	GetOldData  func(c echo.Context) (map[string]interface{}, error)
	GetNewData  func(c echo.Context) (map[string]interface{}, error)
	AuditHandler func(entry *AuditLogEntry) error
}

// AuditLogMiddleware 审计日志中间件（用于敏感操作）
func AuditLogMiddleware(config AuditLogConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			startTime := time.Now()

			// 获取操作前数据
			var oldData map[string]interface{}
			if config.GetOldData != nil {
				oldData, _ = config.GetOldData(c)
			}

			// 读取请求体
			var requestBody map[string]interface{}
			if c.Request().Body != nil {
				bodyBytes, _ := io.ReadAll(c.Request().Body)
				c.Request().Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
				if len(bodyBytes) > 0 {
					json.Unmarshal(bodyBytes, &requestBody)
				}
			}

			// 执行请求
			err := next(c)

			// 获取操作后数据
			var newData map[string]interface{}
			if config.GetNewData != nil {
				newData, _ = config.GetNewData(c)
			}

			// 计算变更字段
			changeFields := calculateChangeFields(oldData, newData)

			// 获取用户信息
			var userID uint64
			var userType, userName string
			if claims := GetUserClaims(c); claims != nil {
				userID = claims.UserID
				userType = string(claims.Role)
				userName = claims.Username
			}

			// 创建审计日志条目
			entry := &AuditLogEntry{
				OperationLogEntry: OperationLogEntry{
					UserID:       userID,
					UserType:     userType,
					UserName:     userName,
					Module:       config.Module,
					Action:       config.Action,
					TargetType:   config.TargetType,
					Description:  config.Description,
					RequestPath:  c.Request().URL.Path,
					Method:       c.Request().Method,
					RequestBody:  sanitizeRequestBody(requestBody),
					ResponseCode: c.Response().Status,
					IP:           c.RealIP(),
					UserAgent:    c.Request().UserAgent(),
					Duration:     time.Since(startTime).Milliseconds(),
					CreatedAt:    time.Now(),
				},
				OldData:      oldData,
				NewData:      newData,
				ChangeFields: changeFields,
			}

			// 异步记录审计日志
			if config.AuditHandler != nil {
				go config.AuditHandler(entry)
			}

			return err
		}
	}
}

// calculateChangeFields 计算变更的字段
func calculateChangeFields(oldData, newData map[string]interface{}) []string {
	if oldData == nil || newData == nil {
		return nil
	}

	var changes []string
	for key, newVal := range newData {
		if oldVal, exists := oldData[key]; exists {
			if !jsonEqual(oldVal, newVal) {
				changes = append(changes, key)
			}
		} else {
			changes = append(changes, key)
		}
	}
	return changes
}

// jsonEqual 比较两个值是否相等
func jsonEqual(a, b interface{}) bool {
	aBytes, _ := json.Marshal(a)
	bBytes, _ := json.Marshal(b)
	return string(aBytes) == string(bBytes)
}

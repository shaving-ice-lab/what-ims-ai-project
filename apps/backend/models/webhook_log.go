package models

import (
	"time"

	"gorm.io/gorm"
)

// WebhookTargetType Webhook目标类型
type WebhookTargetType string

const (
	WebhookTargetStore    WebhookTargetType = "store"
	WebhookTargetSupplier WebhookTargetType = "supplier"
)

// WebhookEventType Webhook事件类型
type WebhookEventType string

const (
	WebhookEventOrderCreated    WebhookEventType = "order.created"
	WebhookEventOrderConfirmed  WebhookEventType = "order.confirmed"
	WebhookEventOrderDelivering WebhookEventType = "order.delivering"
	WebhookEventOrderCompleted  WebhookEventType = "order.completed"
	WebhookEventOrderCancelled  WebhookEventType = "order.cancelled"
	WebhookEventOrderRestored   WebhookEventType = "order.restored"
)

// WebhookStatus Webhook状态
type WebhookStatus string

const (
	WebhookStatusPending WebhookStatus = "pending"
	WebhookStatusSuccess WebhookStatus = "success"
	WebhookStatusFailed  WebhookStatus = "failed"
)

// WebhookLog Webhook推送日志表
type WebhookLog struct {
	ID             uint64            `gorm:"primaryKey;autoIncrement" json:"id"`
	TargetType     WebhookTargetType `gorm:"type:enum('store','supplier');index:idx_target,priority:1" json:"targetType"`
	TargetID       uint64            `gorm:"index:idx_target,priority:2" json:"targetId"`
	EventType      WebhookEventType  `gorm:"type:enum('order.created','order.confirmed','order.delivering','order.completed','order.cancelled','order.restored')" json:"eventType"`
	OrderID        uint64            `gorm:"index:idx_order_id" json:"orderId"`
	WebhookURL     string            `gorm:"type:varchar(500)" json:"webhookUrl"`
	RequestHeaders JSON              `gorm:"type:json" json:"requestHeaders,omitempty"`
	RequestBody    JSON              `gorm:"type:json" json:"requestBody,omitempty"`
	ResponseCode   int               `json:"responseCode,omitempty"`
	ResponseBody   string            `gorm:"type:text" json:"responseBody,omitempty"`
	Status         WebhookStatus     `gorm:"type:enum('pending','success','failed');default:'pending';index:idx_status;index:idx_next_retry,priority:1" json:"status"`
	RetryCount     int               `gorm:"default:0" json:"retryCount"`
	MaxRetryCount  int               `gorm:"default:3" json:"maxRetryCount"`
	NextRetryAt    *time.Time        `gorm:"index:idx_next_retry,priority:2" json:"nextRetryAt,omitempty"`
	ErrorMsg       string            `gorm:"type:varchar(500)" json:"errorMsg,omitempty"`
	DurationMs     int               `json:"durationMs,omitempty"`
	CreatedAt      time.Time         `gorm:"index:idx_created_at" json:"createdAt"`
	UpdatedAt      time.Time         `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt    `gorm:"index" json:"-"`

	// 关联
	Order *Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

// TableName 表名
func (WebhookLog) TableName() string {
	return "webhook_logs"
}

// CanRetry 检查是否可以重试
func (w *WebhookLog) CanRetry() bool {
	return w.Status == WebhookStatusFailed && w.RetryCount < w.MaxRetryCount
}

// SetNextRetry 设置下次重试时间
func (w *WebhookLog) SetNextRetry(intervalMinutes int) {
	nextTime := time.Now().Add(time.Duration(intervalMinutes) * time.Minute)
	w.NextRetryAt = &nextTime
	w.RetryCount++
}

// MarkSuccess 标记成功
func (w *WebhookLog) MarkSuccess(responseCode int, responseBody string, durationMs int) {
	w.Status = WebhookStatusSuccess
	w.ResponseCode = responseCode
	w.ResponseBody = responseBody
	w.DurationMs = durationMs
	w.NextRetryAt = nil
}

// MarkFailed 标记失败
func (w *WebhookLog) MarkFailed(responseCode int, responseBody string, errorMsg string, durationMs int) {
	w.Status = WebhookStatusFailed
	w.ResponseCode = responseCode
	w.ResponseBody = responseBody
	w.ErrorMsg = errorMsg
	w.DurationMs = durationMs
}

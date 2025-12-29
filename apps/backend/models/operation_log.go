package models

import (
	"time"

	"gorm.io/gorm"
)

// LogUserType represents the type of user who performed the operation
type LogUserType string

const (
	LogUserTypeAdmin    LogUserType = "admin"
	LogUserTypeSupplier LogUserType = "supplier"
	LogUserTypeStore    LogUserType = "store"
)

// OperationLog represents the operation_logs table
type OperationLog struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        *uint64        `gorm:"index:idx_user" json:"user_id"`
	UserType      *LogUserType   `gorm:"type:enum('admin','supplier','store');index:idx_user" json:"user_type"`
	UserName      *string        `gorm:"type:varchar(50)" json:"user_name"`
	Module        string         `gorm:"type:varchar(50);not null;index:idx_module_action" json:"module"`
	Action        string         `gorm:"type:varchar(50);not null;index:idx_module_action" json:"action"`
	TargetType    *string        `gorm:"type:varchar(50);index:idx_target" json:"target_type"`
	TargetID      *uint64        `gorm:"index:idx_target" json:"target_id"`
	Description   *string        `gorm:"type:varchar(500)" json:"description"`
	BeforeData    JSONMap        `gorm:"type:json" json:"before_data"`
	AfterData     JSONMap        `gorm:"type:json" json:"after_data"`
	DiffData      JSONMap        `gorm:"type:json" json:"diff_data"`
	IPAddress     *string        `gorm:"type:varchar(50)" json:"ip_address"`
	UserAgent     *string        `gorm:"type:varchar(500)" json:"user_agent"`
	RequestURL    *string        `gorm:"type:varchar(500)" json:"request_url"`
	RequestMethod *string        `gorm:"type:varchar(10)" json:"request_method"`
	CreatedAt     time.Time      `gorm:"index:idx_created_at" json:"created_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName specifies the table name for OperationLog
func (OperationLog) TableName() string {
	return "operation_logs"
}

// NewOperationLog creates a new operation log entry
func NewOperationLog(userID uint64, userType LogUserType, userName, module, action string) *OperationLog {
	return &OperationLog{
		UserID:    &userID,
		UserType:  &userType,
		UserName:  &userName,
		Module:    module,
		Action:    action,
		CreatedAt: time.Now(),
	}
}

// SetTarget sets the target entity for the operation
func (o *OperationLog) SetTarget(targetType string, targetID uint64) *OperationLog {
	o.TargetType = &targetType
	o.TargetID = &targetID
	return o
}

// SetDescription sets the operation description
func (o *OperationLog) SetDescription(description string) *OperationLog {
	o.Description = &description
	return o
}

// SetData sets the before, after, and diff data
func (o *OperationLog) SetData(before, after, diff JSONMap) *OperationLog {
	o.BeforeData = before
	o.AfterData = after
	o.DiffData = diff
	return o
}

// SetRequestInfo sets the request information
func (o *OperationLog) SetRequestInfo(ip, userAgent, url, method string) *OperationLog {
	if ip != "" {
		o.IPAddress = &ip
	}
	if userAgent != "" {
		o.UserAgent = &userAgent
	}
	if url != "" {
		o.RequestURL = &url
	}
	if method != "" {
		o.RequestMethod = &method
	}
	return o
}

// LogRetentionDays 日志保留天数
const LogRetentionDays = 90

// CleanupOldLogs 清理超过保留期的日志
// 日志保留策略：保留90天，定期清理
func CleanupOldLogs(db *gorm.DB) (int64, error) {
	cutoffDate := time.Now().AddDate(0, 0, -LogRetentionDays)
	result := db.Unscoped().Where("created_at < ?", cutoffDate).Delete(&OperationLog{})
	return result.RowsAffected, result.Error
}

// CleanupOldLoginLogs 清理超过保留期的登录日志
func CleanupOldLoginLogs(db *gorm.DB) (int64, error) {
	cutoffDate := time.Now().AddDate(0, 0, -LogRetentionDays)
	result := db.Unscoped().Where("login_at < ?", cutoffDate).Delete(&LoginLog{})
	return result.RowsAffected, result.Error
}

// CleanupOldWebhookLogs 清理超过保留期的Webhook日志
func CleanupOldWebhookLogs(db *gorm.DB) (int64, error) {
	cutoffDate := time.Now().AddDate(0, 0, -LogRetentionDays)
	result := db.Unscoped().Where("created_at < ?", cutoffDate).Delete(&WebhookLog{})
	return result.RowsAffected, result.Error
}

// CleanupAllOldLogs 清理所有类型的过期日志
func CleanupAllOldLogs(db *gorm.DB) (map[string]int64, error) {
	results := make(map[string]int64)

	// 清理操作日志
	count, err := CleanupOldLogs(db)
	if err != nil {
		return results, err
	}
	results["operation_logs"] = count

	// 清理登录日志
	count, err = CleanupOldLoginLogs(db)
	if err != nil {
		return results, err
	}
	results["login_logs"] = count

	// 清理Webhook日志
	count, err = CleanupOldWebhookLogs(db)
	if err != nil {
		return results, err
	}
	results["webhook_logs"] = count

	return results, nil
}

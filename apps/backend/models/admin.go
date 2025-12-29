package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// Permissions represents admin permissions as JSON array
type Permissions []string

// Scan implements the Scanner interface for database reading
func (p *Permissions) Scan(value interface{}) error {
	if value == nil {
		*p = []string{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return json.Unmarshal([]byte(value.(string)), p)
	}
	return json.Unmarshal(bytes, p)
}

// Value implements the driver Valuer interface for database writing
func (p Permissions) Value() (driver.Value, error) {
	return json.Marshal(p)
}

// Admin represents the admin table
type Admin struct {
	ID         uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint64         `gorm:"uniqueIndex;not null" json:"user_id"`
	Name       string         `gorm:"type:varchar(50);not null" json:"name"`
	IsPrimary  int8           `gorm:"type:tinyint(1);default:0" json:"is_primary"` // 1: primary admin, 0: sub admin
	Permissions Permissions    `gorm:"type:json" json:"permissions"`                // JSON array of permissions
	CreatedBy  *uint64        `json:"created_by"`
	Remark     *string        `gorm:"type:varchar(200)" json:"remark"`
	Status     int8           `gorm:"type:tinyint(1);default:1" json:"status"` // 1: enabled, 0: disabled
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User    *User  `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Creator *Admin `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
}

// TableName specifies the table name for Admin
func (Admin) TableName() string {
	return "admins"
}

// HasPermission checks if admin has a specific permission
func (a *Admin) HasPermission(permission string) bool {
	if a.IsPrimary == 1 {
		return true // Primary admin has all permissions
	}
	for _, p := range a.Permissions {
		if p == permission {
			return true
		}
	}
	return false
}

// Available permissions
const (
	PermissionOrder         = "order"
	PermissionReport        = "report"
	PermissionSupplier      = "supplier"
	PermissionStore         = "store"
	PermissionMaterial      = "material"
	PermissionMedia         = "media"
	PermissionProductAudit  = "product_audit"
	PermissionMarkup        = "markup"
	PermissionDeliveryAudit = "delivery_audit"
	PermissionWebhook       = "webhook"
	// Sensitive permissions (only for primary admin)
	PermissionPaymentConfig = "payment_config"
	PermissionAPIConfig     = "api_config"
	PermissionSystemConfig  = "system_config"
	PermissionAdminManage   = "admin_manage"
)

// IsSensitivePermission checks if a permission is sensitive
func IsSensitivePermission(permission string) bool {
	sensitivePerms := []string{
		PermissionPaymentConfig,
		PermissionAPIConfig,
		PermissionSystemConfig,
		PermissionAdminManage,
	}
	for _, p := range sensitivePerms {
		if p == permission {
			return true
		}
	}
	return false
}

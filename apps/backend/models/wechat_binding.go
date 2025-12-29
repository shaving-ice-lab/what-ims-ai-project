package models

import (
	"time"

	"gorm.io/gorm"
)

// BindableType represents the type of entity bound to WeChat
type BindableType string

const (
	BindableTypeStore    BindableType = "store"
	BindableTypeSupplier BindableType = "supplier"
)

// WechatBinding represents the wechat_bindings table
type WechatBinding struct {
	ID           uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	OpenID       string         `gorm:"type:varchar(100);uniqueIndex:uk_openid;not null" json:"openid"`
	UnionID      *string        `gorm:"type:varchar(100)" json:"unionid"`
	UserID       *uint64        `gorm:"index:idx_user_id" json:"user_id"`
	Role         *UserRole      `gorm:"type:enum('admin','sub_admin','supplier','store')" json:"role"`
	BindableID   *uint64        `gorm:"index:idx_bindable" json:"bindable_id"`
	BindableType *BindableType  `gorm:"type:varchar(20);index:idx_bindable" json:"bindable_type"`
	Nickname     *string        `gorm:"type:varchar(100)" json:"nickname"`
	Avatar       *string        `gorm:"type:varchar(500)" json:"avatar"`
	BindTime     *time.Time     `json:"bind_time"`
	Status       int8           `gorm:"type:tinyint(1);default:1" json:"status"` // 1: enabled, 0: disabled
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for WechatBinding
func (WechatBinding) TableName() string {
	return "wechat_bindings"
}

// BeforeCreate hook to set default values
func (w *WechatBinding) BeforeCreate(tx *gorm.DB) error {
	if w.Status == 0 {
		w.Status = 1
	}
	if w.BindTime == nil {
		now := time.Now()
		w.BindTime = &now
	}
	return nil
}

// IsBound checks if the WeChat account is bound to a user
func (w *WechatBinding) IsBound() bool {
	return w.UserID != nil && *w.UserID > 0
}

// IsActive checks if the binding is active
func (w *WechatBinding) IsActive() bool {
	return w.Status == 1
}

// GetBindable returns the bindable entity (store or supplier)
func (w *WechatBinding) GetBindable(db *gorm.DB) (interface{}, error) {
	if w.BindableID == nil || w.BindableType == nil {
		return nil, nil
	}

	switch *w.BindableType {
	case BindableTypeStore:
		var store Store
		if err := db.First(&store, *w.BindableID).Error; err != nil {
			return nil, err
		}
		return &store, nil
	case BindableTypeSupplier:
		var supplier Supplier
		if err := db.First(&supplier, *w.BindableID).Error; err != nil {
			return nil, err
		}
		return &supplier, nil
	default:
		return nil, nil
	}
}

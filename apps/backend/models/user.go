package models

import (
	"time"

	"gorm.io/gorm"
)

// UserRole represents user role types
type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleSubAdmin UserRole = "sub_admin"
	RoleSupplier UserRole = "supplier"
	RoleStore    UserRole = "store"
)

// User represents the user table
type User struct {
	ID             uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	Username       string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	PasswordHash   string         `gorm:"type:varchar(255);not null" json:"-"`
	Role           UserRole       `gorm:"type:enum('admin','sub_admin','supplier','store');not null" json:"role"`
	Phone          *string        `gorm:"type:varchar(20);uniqueIndex" json:"phone"`
	Email          *string        `gorm:"type:varchar(100)" json:"email"`
	Avatar         *string        `gorm:"type:varchar(500)" json:"avatar"`
	LastLoginAt    *time.Time     `json:"last_login_at"`
	LastLoginIP    *string        `gorm:"type:varchar(50)" json:"last_login_ip"`
	LoginFailCount int            `gorm:"default:0" json:"login_fail_count"`
	LockedUntil    *time.Time     `json:"locked_until"`
	Status         int8           `gorm:"type:tinyint(1);default:1" json:"status"` // 1: enabled, 0: disabled
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Admin    *Admin    `gorm:"foreignKey:UserID" json:"admin,omitempty"`
	Store    *Store    `gorm:"foreignKey:UserID" json:"store,omitempty"`
	Supplier *Supplier `gorm:"foreignKey:UserID" json:"supplier,omitempty"`
}

// TableName specifies the table name for User
func (User) TableName() string {
	return "users"
}

// BeforeCreate hook to set default values
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Status == 0 {
		u.Status = 1
	}
	return nil
}

// IsLocked checks if the user account is locked
func (u *User) IsLocked() bool {
	if u.LockedUntil == nil {
		return false
	}
	return u.LockedUntil.After(time.Now())
}

// IsActive checks if the user account is active
func (u *User) IsActive() bool {
	return u.Status == 1 && !u.IsLocked()
}

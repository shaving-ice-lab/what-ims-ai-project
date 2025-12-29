package models

import (
	"time"

	"gorm.io/gorm"
)

// LoginStatus represents the login attempt status
type LoginStatus string

const (
	LoginStatusSuccess LoginStatus = "success"
	LoginStatusFailed  LoginStatus = "failed"
	LoginStatusLocked  LoginStatus = "locked"
)

// LoginLog represents the login_logs table
type LoginLog struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      *uint64        `gorm:"index:idx_user_id" json:"user_id"`
	Username    string         `gorm:"type:varchar(50);not null;index:idx_username" json:"username"`
	Status      LoginStatus    `gorm:"type:enum('success','failed','locked');not null" json:"status"`
	IPAddress   string         `gorm:"type:varchar(50);not null" json:"ip_address"`
	UserAgent   *string        `gorm:"type:varchar(500)" json:"user_agent"`
	DeviceType  *string        `gorm:"type:varchar(50)" json:"device_type"`
	Browser     *string        `gorm:"type:varchar(50)" json:"browser"`
	OS          *string        `gorm:"type:varchar(50)" json:"os"`
	Location    *string        `gorm:"type:varchar(100)" json:"location"`
	FailReason  *string        `gorm:"type:varchar(200)" json:"fail_reason"`
	LoginAt     time.Time      `gorm:"index:idx_login_at" json:"login_at"`
	CreatedAt   time.Time      `json:"created_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for LoginLog
func (LoginLog) TableName() string {
	return "login_logs"
}

// NewSuccessLoginLog creates a new successful login log entry
func NewSuccessLoginLog(userID uint64, username, ipAddress, userAgent string) *LoginLog {
	now := time.Now()
	return &LoginLog{
		UserID:    &userID,
		Username:  username,
		Status:    LoginStatusSuccess,
		IPAddress: ipAddress,
		UserAgent: &userAgent,
		LoginAt:   now,
		CreatedAt: now,
	}
}

// NewFailedLoginLog creates a new failed login log entry
func NewFailedLoginLog(username, ipAddress, userAgent, reason string) *LoginLog {
	now := time.Now()
	return &LoginLog{
		Username:   username,
		Status:     LoginStatusFailed,
		IPAddress:  ipAddress,
		UserAgent:  &userAgent,
		FailReason: &reason,
		LoginAt:    now,
		CreatedAt:  now,
	}
}

// NewLockedLoginLog creates a new locked account login log entry
func NewLockedLoginLog(username, ipAddress, userAgent string) *LoginLog {
	now := time.Now()
	reason := "Account locked due to too many failed attempts"
	return &LoginLog{
		Username:   username,
		Status:     LoginStatusLocked,
		IPAddress:  ipAddress,
		UserAgent:  &userAgent,
		FailReason: &reason,
		LoginAt:    now,
		CreatedAt:  now,
	}
}

// SetDeviceInfo sets device information parsed from user agent
func (l *LoginLog) SetDeviceInfo(deviceType, browser, os string) *LoginLog {
	if deviceType != "" {
		l.DeviceType = &deviceType
	}
	if browser != "" {
		l.Browser = &browser
	}
	if os != "" {
		l.OS = &os
	}
	return l
}

// SetLocation sets the location based on IP
func (l *LoginLog) SetLocation(location string) *LoginLog {
	if location != "" {
		l.Location = &location
	}
	return l
}

// IsSuccess checks if the login was successful
func (l *LoginLog) IsSuccess() bool {
	return l.Status == LoginStatusSuccess
}

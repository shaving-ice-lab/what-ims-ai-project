package models

import (
	"time"

	"gorm.io/gorm"
)

// SettingChangeType represents the type of setting change
type SettingChangeType string

const (
	ChangeTypeMinOrder     SettingChangeType = "min_order"
	ChangeTypeDeliveryDays SettingChangeType = "delivery_days"
	ChangeTypeDeliveryArea SettingChangeType = "delivery_area"
)

// AuditStatus represents the audit status
type AuditStatus string

const (
	AuditStatusPending  AuditStatus = "pending"
	AuditStatusApproved AuditStatus = "approved"
	AuditStatusRejected AuditStatus = "rejected"
)

// SupplierSettingAudit represents the supplier_setting_audits table
type SupplierSettingAudit struct {
	ID           uint64            `gorm:"primaryKey;autoIncrement" json:"id"`
	SupplierID   uint64            `gorm:"not null;index:idx_supplier_id" json:"supplier_id"`
	ChangeType   SettingChangeType `gorm:"type:enum('min_order','delivery_days','delivery_area');not null" json:"change_type"`
	OldValue     JSONMap           `gorm:"type:json" json:"old_value"`
	NewValue     JSONMap           `gorm:"type:json" json:"new_value"`
	Status       AuditStatus       `gorm:"type:enum('pending','approved','rejected');default:'pending';index:idx_status" json:"status"`
	SubmitTime   time.Time         `gorm:"index:idx_submit_time" json:"submit_time"`
	AuditTime    *time.Time        `json:"audit_time"`
	AuditorID    *uint64           `json:"auditor_id"`
	RejectReason *string           `gorm:"type:varchar(500)" json:"reject_reason"`
	CreatedAt    time.Time         `json:"created_at"`
	UpdatedAt    time.Time         `json:"updated_at"`
	DeletedAt    gorm.DeletedAt    `gorm:"index" json:"-"`

	// Relationships
	Supplier *Supplier `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	Auditor  *Admin    `gorm:"foreignKey:AuditorID" json:"auditor,omitempty"`
}

// TableName specifies the table name for SupplierSettingAudit
func (SupplierSettingAudit) TableName() string {
	return "supplier_setting_audits"
}

// BeforeCreate hook to set default values
func (s *SupplierSettingAudit) BeforeCreate(tx *gorm.DB) error {
	if s.Status == "" {
		s.Status = AuditStatusPending
	}
	if s.SubmitTime.IsZero() {
		s.SubmitTime = time.Now()
	}
	return nil
}

// IsPending checks if the audit is pending
func (s *SupplierSettingAudit) IsPending() bool {
	return s.Status == AuditStatusPending
}

// IsApproved checks if the audit is approved
func (s *SupplierSettingAudit) IsApproved() bool {
	return s.Status == AuditStatusApproved
}

// IsRejected checks if the audit is rejected
func (s *SupplierSettingAudit) IsRejected() bool {
	return s.Status == AuditStatusRejected
}

// Approve approves the audit
func (s *SupplierSettingAudit) Approve(auditorID uint64) {
	now := time.Now()
	s.Status = AuditStatusApproved
	s.AuditTime = &now
	s.AuditorID = &auditorID
}

// Reject rejects the audit with a reason
func (s *SupplierSettingAudit) Reject(auditorID uint64, reason string) {
	now := time.Now()
	s.Status = AuditStatusRejected
	s.AuditTime = &now
	s.AuditorID = &auditorID
	s.RejectReason = &reason
}

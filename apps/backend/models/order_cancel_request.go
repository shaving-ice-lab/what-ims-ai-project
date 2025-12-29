package models

import (
	"time"

	"gorm.io/gorm"
)

// CancelRequestStatus represents the cancel request status
type CancelRequestStatus string

const (
	CancelRequestPending  CancelRequestStatus = "pending"
	CancelRequestApproved CancelRequestStatus = "approved"
	CancelRequestRejected CancelRequestStatus = "rejected"
)

// OrderCancelRequest represents the order_cancel_requests table
type OrderCancelRequest struct {
	ID                uint64              `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID           uint64              `gorm:"not null;index:idx_order_id" json:"order_id"`
	StoreID           uint64              `gorm:"not null" json:"store_id"`
	Reason            string              `gorm:"type:varchar(500);not null" json:"reason"`
	Status            CancelRequestStatus `gorm:"type:enum('pending','approved','rejected');default:'pending';index:idx_status" json:"status"`
	AdminID           *uint64             `json:"admin_id"`
	AdminRemark       *string             `gorm:"type:varchar(500)" json:"admin_remark"`
	SupplierContacted int8                `gorm:"type:tinyint(1);default:0" json:"supplier_contacted"`
	SupplierResponse  *string             `gorm:"type:varchar(500)" json:"supplier_response"`
	ProcessedAt       *time.Time          `json:"processed_at"`
	CreatedAt         time.Time           `gorm:"index:idx_created_at" json:"created_at"`
	UpdatedAt         time.Time           `json:"updated_at"`
	DeletedAt         gorm.DeletedAt      `gorm:"index" json:"-"`

	// Relationships
	Order *Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Store *Store `gorm:"foreignKey:StoreID" json:"store,omitempty"`
	Admin *Admin `gorm:"foreignKey:AdminID" json:"admin,omitempty"`
}

// TableName specifies the table name for OrderCancelRequest
func (OrderCancelRequest) TableName() string {
	return "order_cancel_requests"
}

// BeforeCreate hook to set default values
func (o *OrderCancelRequest) BeforeCreate(tx *gorm.DB) error {
	if o.Status == "" {
		o.Status = CancelRequestPending
	}
	return nil
}

// IsPending checks if the request is pending
func (o *OrderCancelRequest) IsPending() bool {
	return o.Status == CancelRequestPending
}

// IsApproved checks if the request is approved
func (o *OrderCancelRequest) IsApproved() bool {
	return o.Status == CancelRequestApproved
}

// IsRejected checks if the request is rejected
func (o *OrderCancelRequest) IsRejected() bool {
	return o.Status == CancelRequestRejected
}

// Approve approves the cancel request
func (o *OrderCancelRequest) Approve(adminID uint64, remark string) {
	now := time.Now()
	o.Status = CancelRequestApproved
	o.AdminID = &adminID
	if remark != "" {
		o.AdminRemark = &remark
	}
	o.ProcessedAt = &now
}

// Reject rejects the cancel request
func (o *OrderCancelRequest) Reject(adminID uint64, remark string) {
	now := time.Now()
	o.Status = CancelRequestRejected
	o.AdminID = &adminID
	if remark != "" {
		o.AdminRemark = &remark
	}
	o.ProcessedAt = &now
}

// SetSupplierContacted marks supplier as contacted
func (o *OrderCancelRequest) SetSupplierContacted(response string) {
	o.SupplierContacted = 1
	if response != "" {
		o.SupplierResponse = &response
	}
}

package models

import (
	"time"

	"gorm.io/gorm"
)

// OperatorType represents the type of operator who performed the action
type OperatorType string

const (
	OperatorTypeStore    OperatorType = "store"
	OperatorTypeSupplier OperatorType = "supplier"
	OperatorTypeAdmin    OperatorType = "admin"
	OperatorTypeSystem   OperatorType = "system"
)

// OrderStatusLog represents the order_status_logs table
type OrderStatusLog struct {
	ID           uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID      uint64         `gorm:"not null;index:idx_order_id" json:"order_id"`
	FromStatus   *string        `gorm:"type:varchar(30)" json:"from_status"`
	ToStatus     string         `gorm:"type:varchar(30);not null" json:"to_status"`
	OperatorType *OperatorType  `gorm:"type:enum('store','supplier','admin','system')" json:"operator_type"`
	OperatorID   *uint64        `json:"operator_id"`
	Remark       *string        `gorm:"type:varchar(200)" json:"remark"`
	CreatedAt    time.Time      `json:"created_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Order *Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

// TableName specifies the table name for OrderStatusLog
func (OrderStatusLog) TableName() string {
	return "order_status_logs"
}

// NewOrderStatusLog creates a new order status log entry
func NewOrderStatusLog(orderID uint64, fromStatus, toStatus string, operatorType OperatorType, operatorID uint64, remark string) *OrderStatusLog {
	log := &OrderStatusLog{
		OrderID:      orderID,
		ToStatus:     toStatus,
		OperatorType: &operatorType,
		CreatedAt:    time.Now(),
	}

	if fromStatus != "" {
		log.FromStatus = &fromStatus
	}
	if operatorID > 0 {
		log.OperatorID = &operatorID
	}
	if remark != "" {
		log.Remark = &remark
	}

	return log
}

// NewSystemStatusLog creates a new order status log entry for system operations
func NewSystemStatusLog(orderID uint64, fromStatus, toStatus string, remark string) *OrderStatusLog {
	operatorType := OperatorTypeSystem
	log := &OrderStatusLog{
		OrderID:      orderID,
		ToStatus:     toStatus,
		OperatorType: &operatorType,
		CreatedAt:    time.Now(),
	}

	if fromStatus != "" {
		log.FromStatus = &fromStatus
	}
	if remark != "" {
		log.Remark = &remark
	}

	return log
}

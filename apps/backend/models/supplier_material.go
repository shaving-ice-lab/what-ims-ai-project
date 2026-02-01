package models

import (
	"time"

	"gorm.io/gorm"
)

// StockStatus represents stock status types
type StockStatus string

const (
	StockStatusInStock    StockStatus = "in_stock"
	StockStatusOutOfStock StockStatus = "out_of_stock"
)

// AuditStatus is defined in supplier_setting_audit.go

// SupplierMaterial represents the supplier_materials table
type SupplierMaterial struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	SupplierID    uint64         `gorm:"index;not null" json:"supplier_id"`
	MaterialSkuID uint64         `gorm:"index;not null" json:"material_sku_id"`
	Price         float64        `gorm:"type:decimal(10,2);not null" json:"price"`
	OriginalPrice *float64       `gorm:"type:decimal(10,2)" json:"original_price,omitempty"`
	MinQuantity   int            `gorm:"default:1" json:"min_quantity"`
	StepQuantity  int            `gorm:"default:1" json:"step_quantity"`
	StockStatus   StockStatus    `gorm:"type:enum('in_stock','out_of_stock');default:'in_stock'" json:"stock_status"`
	AuditStatus   AuditStatus    `gorm:"type:enum('pending','approved','rejected')" json:"audit_status"`
	RejectReason  *string        `gorm:"type:varchar(200)" json:"reject_reason,omitempty"`
	IsRecommended int8           `gorm:"type:tinyint(1);default:0" json:"is_recommended"`
	SalesCount    int            `gorm:"default:0" json:"sales_count"`
	Status        int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Supplier    *Supplier    `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	MaterialSku *MaterialSku `gorm:"foreignKey:MaterialSkuID" json:"material_sku,omitempty"`
}

// TableName specifies the table name for SupplierMaterial
func (SupplierMaterial) TableName() string {
	return "supplier_materials"
}

// BeforeCreate hook to set default values
func (s *SupplierMaterial) BeforeCreate(tx *gorm.DB) error {
	if s.MinQuantity == 0 {
		s.MinQuantity = 1
	}
	if s.StepQuantity == 0 {
		s.StepQuantity = 1
	}
	if s.StockStatus == "" {
		s.StockStatus = StockStatusInStock
	}
	if s.AuditStatus == "" {
		s.AuditStatus = AuditStatusPending
	}
	if s.Status == 0 {
		s.Status = 1
	}
	return nil
}

// IsActive checks if the supplier material is active
func (s *SupplierMaterial) IsActive() bool {
	return s.Status == 1 && s.AuditStatus == AuditStatusApproved
}

// IsAvailable checks if the material is available for purchase
func (s *SupplierMaterial) IsAvailable() bool {
	return s.IsActive() && s.StockStatus == StockStatusInStock
}

// GetDiscountRate returns the discount rate if original price exists
func (s *SupplierMaterial) GetDiscountRate() float64 {
	if s.OriginalPrice == nil || *s.OriginalPrice == 0 {
		return 0
	}
	return ((*s.OriginalPrice - s.Price) / *s.OriginalPrice) * 100
}

// ValidateQuantity checks if the quantity meets minimum and step requirements
func (s *SupplierMaterial) ValidateQuantity(quantity int) bool {
	if quantity < s.MinQuantity {
		return false
	}
	// Check if quantity follows step requirement
	diff := quantity - s.MinQuantity
	return diff%s.StepQuantity == 0
}

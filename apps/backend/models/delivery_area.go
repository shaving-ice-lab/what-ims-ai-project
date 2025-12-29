package models

import (
	"time"

	"gorm.io/gorm"
)

// DeliveryArea represents the delivery_areas table
type DeliveryArea struct {
	ID         uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	SupplierID uint64         `gorm:"index;not null" json:"supplier_id"`
	Province   string         `gorm:"type:varchar(50);not null" json:"province"`
	City       string         `gorm:"type:varchar(50);not null" json:"city"`
	District   *string        `gorm:"type:varchar(50)" json:"district"` // NULL means entire city
	Status     int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Supplier *Supplier `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
}

// TableName specifies the table name for DeliveryArea
func (DeliveryArea) TableName() string {
	return "delivery_areas"
}

// BeforeCreate hook to set default values
func (d *DeliveryArea) BeforeCreate(tx *gorm.DB) error {
	if d.Status == 0 {
		d.Status = 1
	}
	return nil
}

// IsActive checks if the delivery area is active
func (d *DeliveryArea) IsActive() bool {
	return d.Status == 1
}

// Covers checks if this delivery area covers a specific location
func (d *DeliveryArea) Covers(province, city, district string) bool {
	if d.Province != province {
		return false
	}
	if d.City != city {
		return false
	}
	// If District is nil, it covers the entire city
	if d.District == nil {
		return true
	}
	// Otherwise, check specific district
	return *d.District == district
}

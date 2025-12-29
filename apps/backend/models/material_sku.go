package models

import (
	"time"

	"gorm.io/gorm"
)

// MaterialSku represents the material_skus table
type MaterialSku struct {
	ID         uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	SkuNo      string         `gorm:"type:varchar(30);uniqueIndex" json:"sku_no"`
	MaterialID uint64         `gorm:"index;not null" json:"material_id"`
	Brand      string         `gorm:"type:varchar(50);not null" json:"brand"`
	Spec       string         `gorm:"type:varchar(100);not null" json:"spec"`
	Unit       string         `gorm:"type:varchar(20);not null" json:"unit"`
	Weight     *float64       `gorm:"type:decimal(10,3)" json:"weight,omitempty"`
	Barcode    *string        `gorm:"type:varchar(50);index" json:"barcode,omitempty"`
	ImageURL   *string        `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	Status     int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Material         *Material            `gorm:"foreignKey:MaterialID" json:"material,omitempty"`
	SupplierMaterials []*SupplierMaterial `gorm:"foreignKey:MaterialSkuID" json:"supplier_materials,omitempty"`
}

// TableName specifies the table name for MaterialSku
func (MaterialSku) TableName() string {
	return "material_skus"
}

// BeforeCreate hook to generate SKU number
func (m *MaterialSku) BeforeCreate(tx *gorm.DB) error {
	if m.SkuNo == "" {
		m.SkuNo = generateSkuNo()
	}
	if m.Status == 0 {
		m.Status = 1
	}
	return nil
}

// generateSkuNo generates a unique SKU number
func generateSkuNo() string {
	// Format: SKU + timestamp (YYMMDDHHmmss) + random 6 digits
	return "SKU" + time.Now().Format("060102150405") + generateRandomDigits(6)
}

// IsActive checks if the SKU is active
func (m *MaterialSku) IsActive() bool {
	return m.Status == 1
}

// GetFullName returns the full name including brand and spec
func (m *MaterialSku) GetFullName() string {
	if m.Material != nil {
		return m.Material.Name + " " + m.Brand + " " + m.Spec
	}
	return m.Brand + " " + m.Spec
}

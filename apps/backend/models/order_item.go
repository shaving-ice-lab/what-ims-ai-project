package models

import (
	"time"

	"gorm.io/gorm"
)

// OrderItem represents the order_items table
type OrderItem struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID       uint64         `gorm:"index;not null" json:"order_id"`
	MaterialSkuID uint64         `json:"material_sku_id"`
	MaterialName  string         `gorm:"type:varchar(100)" json:"material_name"`
	Brand         string         `gorm:"type:varchar(50)" json:"brand"`
	Spec          string         `gorm:"type:varchar(100)" json:"spec"`
	Unit          string         `gorm:"type:varchar(20)" json:"unit"`
	ImageURL      *string        `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	Quantity      int            `gorm:"not null" json:"quantity"`
	UnitPrice     float64        `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	MarkupAmount  float64        `gorm:"type:decimal(10,2);default:0" json:"markup_amount"`
	FinalPrice    float64        `gorm:"type:decimal(10,2);not null" json:"final_price"`
	Subtotal      float64        `gorm:"type:decimal(10,2);not null" json:"subtotal"`
	CreatedAt     time.Time      `json:"created_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Order       *Order       `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	MaterialSku *MaterialSku `gorm:"foreignKey:MaterialSkuID" json:"material_sku,omitempty"`
}

// TableName specifies the table name for OrderItem
func (OrderItem) TableName() string {
	return "order_items"
}

// BeforeCreate hook to calculate subtotal
func (o *OrderItem) BeforeCreate(tx *gorm.DB) error {
	o.Subtotal = o.FinalPrice * float64(o.Quantity)
	return nil
}

// BeforeUpdate hook to recalculate subtotal
func (o *OrderItem) BeforeUpdate(tx *gorm.DB) error {
	o.Subtotal = o.FinalPrice * float64(o.Quantity)
	return nil
}

// GetMarkupRate returns the markup rate percentage
func (o *OrderItem) GetMarkupRate() float64 {
	if o.UnitPrice == 0 {
		return 0
	}
	return (o.MarkupAmount / o.UnitPrice) * 100
}

// GetTotalMarkup returns the total markup for this item
func (o *OrderItem) GetTotalMarkup() float64 {
	return o.MarkupAmount * float64(o.Quantity)
}

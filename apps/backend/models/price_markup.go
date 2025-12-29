package models

import (
	"time"

	"gorm.io/gorm"
)

// MarkupType 加价方式
type MarkupType string

const (
	MarkupTypeFixed   MarkupType = "fixed"
	MarkupTypePercent MarkupType = "percent"
)

// PriceMarkup 加价规则表
type PriceMarkup struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string         `gorm:"type:varchar(100);not null" json:"name"`
	Description string         `gorm:"type:varchar(500)" json:"description,omitempty"`
	StoreID     *uint64        `gorm:"index:idx_store_id" json:"storeId,omitempty"`
	SupplierID  *uint64        `gorm:"index:idx_supplier_id" json:"supplierId,omitempty"`
	CategoryID  *uint64        `json:"categoryId,omitempty"`
	MaterialID  *uint64        `json:"materialId,omitempty"`
	MarkupType  MarkupType     `gorm:"type:enum('fixed','percent');not null" json:"markupType"`
	MarkupValue float64        `gorm:"type:decimal(10,4);not null" json:"markupValue"`
	MinMarkup   float64        `gorm:"type:decimal(10,2)" json:"minMarkup,omitempty"`
	MaxMarkup   float64        `gorm:"type:decimal(10,2)" json:"maxMarkup,omitempty"`
	Priority    int            `gorm:"default:0;index:idx_active_priority" json:"priority"`
	IsActive    bool           `gorm:"default:true;index:idx_active_priority" json:"isActive"`
	StartTime   *time.Time     `json:"startTime,omitempty"`
	EndTime     *time.Time     `json:"endTime,omitempty"`
	CreatedBy   uint64         `json:"createdBy"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// 关联
	Store    *Store    `gorm:"foreignKey:StoreID" json:"store,omitempty"`
	Supplier *Supplier `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	Category *Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Material *Material `gorm:"foreignKey:MaterialID" json:"material,omitempty"`
}

// TableName 表名
func (PriceMarkup) TableName() string {
	return "price_markups"
}

// CalculateMarkup 计算加价金额
func (p *PriceMarkup) CalculateMarkup(originalPrice float64) float64 {
	var markup float64

	if p.MarkupType == MarkupTypeFixed {
		markup = p.MarkupValue
	} else {
		markup = originalPrice * p.MarkupValue
	}

	// 应用最小/最大限制
	if p.MinMarkup > 0 && markup < p.MinMarkup {
		markup = p.MinMarkup
	}
	if p.MaxMarkup > 0 && markup > p.MaxMarkup {
		markup = p.MaxMarkup
	}

	return markup
}

// IsValidNow 检查规则当前是否有效
func (p *PriceMarkup) IsValidNow() bool {
	if !p.IsActive {
		return false
	}

	now := time.Now()

	if p.StartTime != nil && now.Before(*p.StartTime) {
		return false
	}

	if p.EndTime != nil && now.After(*p.EndTime) {
		return false
	}

	return true
}

package models

import (
	"time"

	"gorm.io/gorm"
)

// Category represents the categories table for materials
type Category struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	Name          string         `gorm:"type:varchar(50);not null" json:"name"`
	Icon          *string        `gorm:"type:varchar(500)" json:"icon,omitempty"`
	SortOrder     int            `gorm:"default:0" json:"sort_order"`
	ParentID      *uint64        `gorm:"index" json:"parent_id,omitempty"`
	Level         int8           `gorm:"type:tinyint" json:"level"`
	Path          string         `gorm:"type:varchar(200)" json:"path"`
	MarkupEnabled int8           `gorm:"type:tinyint(1);default:1" json:"markup_enabled"`
	Status        int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt     time.Time      `json:"created_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Parent   *Category   `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children []*Category `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	Materials []*Material `gorm:"foreignKey:CategoryID" json:"materials,omitempty"`
}

// TableName specifies the table name for Category
func (Category) TableName() string {
	return "categories"
}

// BeforeCreate hook to set default values and generate path
func (c *Category) BeforeCreate(tx *gorm.DB) error {
	if c.Status == 0 {
		c.Status = 1
	}
	if c.MarkupEnabled == 0 {
		c.MarkupEnabled = 1
	}

	// Set level and path based on parent
	if c.ParentID == nil {
		c.Level = 1
		c.Path = ""
	} else {
		var parent Category
		if err := tx.First(&parent, c.ParentID).Error; err != nil {
			return err
		}
		c.Level = parent.Level + 1
		if parent.Path == "" {
			c.Path = string(parent.ID)
		} else {
			c.Path = parent.Path + "/" + string(parent.ID)
		}
	}

	return nil
}

// IsActive checks if the category is active
func (c *Category) IsActive() bool {
	return c.Status == 1
}

// IsTopLevel checks if this is a top-level category
func (c *Category) IsTopLevel() bool {
	return c.ParentID == nil || c.Level == 1
}

// GetFullPath returns the full path including this category
func (c *Category) GetFullPath() string {
	if c.Path == "" {
		return string(c.ID)
	}
	return c.Path + "/" + string(c.ID)
}

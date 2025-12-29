package models

import (
	"time"

	"gorm.io/gorm"
)

// MediaImage represents the media_images table
type MediaImage struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	CategoryID    *uint64        `gorm:"index:idx_category_brand" json:"category_id"`
	Brand         *string        `gorm:"type:varchar(50);index:idx_category_brand" json:"brand"`
	Name          *string        `gorm:"type:varchar(100)" json:"name"`
	URL           string         `gorm:"type:varchar(500);not null" json:"url"`
	ThumbnailURL  *string        `gorm:"type:varchar(500)" json:"thumbnail_url"`
	FileSize      *int           `json:"file_size"`
	Width         *int           `json:"width"`
	Height        *int           `json:"height"`
	Tags          JSONArray      `gorm:"type:json" json:"tags"`
	SkuCodes      JSONArray      `gorm:"type:json" json:"sku_codes"`
	MatchKeywords *string        `gorm:"type:varchar(500)" json:"match_keywords"`
	UsageCount    int            `gorm:"default:0" json:"usage_count"`
	Status        int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	UploadedBy    *uint64        `json:"uploaded_by"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Category *Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
}

// TableName specifies the table name for MediaImage
func (MediaImage) TableName() string {
	return "media_images"
}

// BeforeCreate hook to set default values
func (m *MediaImage) BeforeCreate(tx *gorm.DB) error {
	if m.Status == 0 {
		m.Status = 1
	}
	return nil
}

// IncrementUsageCount increments the usage count
func (m *MediaImage) IncrementUsageCount() {
	m.UsageCount++
}

// IsActive checks if the media image is active
func (m *MediaImage) IsActive() bool {
	return m.Status == 1
}

// JSONArray is a helper type for JSON array fields
type JSONArray []string

// Scan implements the sql.Scanner interface
func (j *JSONArray) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	return scanJSON(value, j)
}

// Value implements the driver.Valuer interface
func (j JSONArray) Value() (interface{}, error) {
	return valueJSON(j)
}

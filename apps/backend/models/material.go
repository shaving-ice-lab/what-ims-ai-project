package models

import (
	"time"

	"gorm.io/gorm"
)

// Material represents the materials table
type Material struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	MaterialNo  string         `gorm:"type:varchar(20);uniqueIndex" json:"material_no"`
	CategoryID  uint64         `gorm:"index;not null" json:"category_id"`
	Name        string         `gorm:"type:varchar(100);not null" json:"name"`
	Alias       *string        `gorm:"type:varchar(100)" json:"alias,omitempty"`
	Description *string        `gorm:"type:text" json:"description,omitempty"`
	ImageURL    *string        `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	Keywords    *string        `gorm:"type:varchar(200)" json:"keywords,omitempty"`
	SortOrder   int            `gorm:"default:0" json:"sort_order"`
	Status      int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Category     *Category      `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	MaterialSkus []*MaterialSku `gorm:"foreignKey:MaterialID" json:"skus,omitempty"`
}

// TableName specifies the table name for Material
func (Material) TableName() string {
	return "materials"
}

// BeforeCreate hook to generate material number
func (m *Material) BeforeCreate(tx *gorm.DB) error {
	if m.MaterialNo == "" {
		m.MaterialNo = generateMaterialNo()
	}
	if m.Status == 0 {
		m.Status = 1
	}
	return nil
}

// generateMaterialNo generates a unique material number
func generateMaterialNo() string {
	// Format: MAT + timestamp (YYMMDDHHmmss) + random 4 digits
	return "MAT" + time.Now().Format("060102150405") + generateRandomDigits(4)
}

// IsActive checks if the material is active
func (m *Material) IsActive() bool {
	return m.Status == 1
}

// GetSearchText returns concatenated text for search indexing
func (m *Material) GetSearchText() string {
	searchText := m.Name
	if m.Alias != nil {
		searchText += " " + *m.Alias
	}
	if m.Keywords != nil {
		searchText += " " + *m.Keywords
	}
	return searchText
}

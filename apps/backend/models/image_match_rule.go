package models

import (
	"time"

	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// MatchRuleType represents the type of matching rule
type MatchRuleType string

const (
	MatchRuleTypeName    MatchRuleType = "name"
	MatchRuleTypeBrand   MatchRuleType = "brand"
	MatchRuleTypeSku     MatchRuleType = "sku"
	MatchRuleTypeKeyword MatchRuleType = "keyword"
)

// ImageMatchRule represents the image_match_rules table
type ImageMatchRule struct {
	ID                  uint64          `gorm:"primaryKey;autoIncrement" json:"id"`
	Name                *string         `gorm:"type:varchar(100)" json:"name"`
	RuleType            MatchRuleType   `gorm:"type:enum('name','brand','sku','keyword');not null" json:"rule_type"`
	MatchPattern        *string         `gorm:"type:varchar(200)" json:"match_pattern"`
	SimilarityThreshold decimal.Decimal `gorm:"type:decimal(3,2);default:0.80" json:"similarity_threshold"`
	Priority            int             `gorm:"default:0;index:idx_active_priority" json:"priority"`
	IsActive            int8            `gorm:"type:tinyint(1);default:1;index:idx_active_priority" json:"is_active"`
	CreatedAt           time.Time       `json:"created_at"`
	UpdatedAt           time.Time       `json:"updated_at"`
	DeletedAt           gorm.DeletedAt  `gorm:"index" json:"-"`
}

// TableName specifies the table name for ImageMatchRule
func (ImageMatchRule) TableName() string {
	return "image_match_rules"
}

// BeforeCreate hook to set default values
func (i *ImageMatchRule) BeforeCreate(tx *gorm.DB) error {
	if i.IsActive == 0 {
		i.IsActive = 1
	}
	if i.SimilarityThreshold.IsZero() {
		i.SimilarityThreshold = decimal.NewFromFloat(0.8)
	}
	return nil
}

// IsEnabled checks if the rule is enabled
func (i *ImageMatchRule) IsEnabled() bool {
	return i.IsActive == 1
}

// SetEnabled enables or disables the rule
func (i *ImageMatchRule) SetEnabled(enabled bool) {
	if enabled {
		i.IsActive = 1
	} else {
		i.IsActive = 0
	}
}

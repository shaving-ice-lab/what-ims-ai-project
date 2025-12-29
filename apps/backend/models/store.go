package models

import (
	"database/sql/driver"
	"time"

	"gorm.io/gorm"
)

// Store represents the store table
type Store struct {
	ID               uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID           uint64         `gorm:"uniqueIndex;not null" json:"user_id"`
	StoreNo          string         `gorm:"type:varchar(20);uniqueIndex" json:"store_no"`
	Name             string         `gorm:"type:varchar(100);not null" json:"name"`
	Logo             *string        `gorm:"type:varchar(500)" json:"logo"`
	Province         *string        `gorm:"type:varchar(50)" json:"province"`
	City             *string        `gorm:"type:varchar(50)" json:"city"`
	District         *string        `gorm:"type:varchar(50)" json:"district"`
	Address          *string        `gorm:"type:varchar(200)" json:"address"`
	Latitude         *float64       `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude        *float64       `gorm:"type:decimal(10,7)" json:"longitude"`
	ContactName      string         `gorm:"type:varchar(50);not null" json:"contact_name"`
	ContactPhone     string         `gorm:"type:varchar(20);not null" json:"contact_phone"`
	MarkupEnabled    int8           `gorm:"type:tinyint(1);default:1" json:"markup_enabled"`
	WechatWebhookURL *string        `gorm:"type:varchar(500)" json:"wechat_webhook_url"`
	WebhookEnabled   int8           `gorm:"type:tinyint(1);default:0" json:"webhook_enabled"`
	Status           int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User   *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Orders []*Order `gorm:"foreignKey:StoreID" json:"orders,omitempty"`
}

// TableName specifies the table name for Store
func (Store) TableName() string {
	return "stores"
}

// BeforeCreate hook to generate store number
func (s *Store) BeforeCreate(tx *gorm.DB) error {
	if s.StoreNo == "" {
		s.StoreNo = generateStoreNo()
	}
	if s.Status == 0 {
		s.Status = 1
	}
	if s.MarkupEnabled == 0 {
		s.MarkupEnabled = 1
	}
	return nil
}

// generateStoreNo generates a unique store number
func generateStoreNo() string {
	// Format: S + timestamp (YYMMDDHHmmss) + random 4 digits
	return "S" + time.Now().Format("060102150405") + generateRandomDigits(4)
}

// IsActive checks if the store is active
func (s *Store) IsActive() bool {
	return s.Status == 1
}

// HasWebhook checks if webhook is enabled for the store
func (s *Store) HasWebhook() bool {
	return s.WebhookEnabled == 1 && s.WechatWebhookURL != nil && *s.WechatWebhookURL != ""
}

// GetFullAddress returns the full address of the store
func (s *Store) GetFullAddress() string {
	addr := ""
	if s.Province != nil {
		addr += *s.Province
	}
	if s.City != nil {
		addr += *s.City
	}
	if s.District != nil {
		addr += *s.District
	}
	if s.Address != nil {
		addr += *s.Address
	}
	return addr
}

// Location represents a geographical location
type Location struct {
	Latitude  float64
	Longitude float64
}

// Value implements the driver Valuer interface
func (l Location) Value() (driver.Value, error) {
	return []interface{}{l.Latitude, l.Longitude}, nil
}

// GetLocation returns the store's location
func (s *Store) GetLocation() *Location {
	if s.Latitude != nil && s.Longitude != nil {
		return &Location{
			Latitude:  *s.Latitude,
			Longitude: *s.Longitude,
		}
	}
	return nil
}

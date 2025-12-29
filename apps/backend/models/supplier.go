package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// DeliveryMode represents delivery mode types
type DeliveryMode string

const (
	DeliverySelf    DeliveryMode = "self_delivery"
	DeliveryExpress DeliveryMode = "express_delivery"
)

// ManagementMode represents supplier management mode
type ManagementMode string

const (
	ManagementSelf    ManagementMode = "self"
	ManagementManaged ManagementMode = "managed"
	ManagementWebhook ManagementMode = "webhook"
	ManagementAPI     ManagementMode = "api"
)

// DeliveryDays represents delivery days as JSON array
type DeliveryDays []int

// Scan implements the Scanner interface
func (d *DeliveryDays) Scan(value interface{}) error {
	if value == nil {
		*d = []int{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return json.Unmarshal([]byte(value.(string)), d)
	}
	return json.Unmarshal(bytes, d)
}

// Value implements the driver Valuer interface
func (d DeliveryDays) Value() (driver.Value, error) {
	return json.Marshal(d)
}

// WebhookEvents represents webhook events as JSON array
type WebhookEvents []string

// Scan implements the Scanner interface
func (w *WebhookEvents) Scan(value interface{}) error {
	if value == nil {
		*w = []string{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return json.Unmarshal([]byte(value.(string)), w)
	}
	return json.Unmarshal(bytes, w)
}

// Value implements the driver Valuer interface
func (w WebhookEvents) Value() (driver.Value, error) {
	return json.Marshal(w)
}

// Supplier represents the supplier table
type Supplier struct {
	ID               uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID           uint64         `gorm:"index;not null" json:"user_id"`
	SupplierNo       string         `gorm:"type:varchar(20);uniqueIndex" json:"supplier_no"`
	Name             string         `gorm:"type:varchar(100);not null" json:"name"`
	DisplayName      string         `gorm:"type:varchar(100)" json:"display_name"`
	Logo             *string        `gorm:"type:varchar(500)" json:"logo"`
	ContactName      string         `gorm:"type:varchar(50);not null" json:"contact_name"`
	ContactPhone     string         `gorm:"type:varchar(20);not null" json:"contact_phone"`
	MinOrderAmount   float64        `gorm:"type:decimal(10,2);default:0" json:"min_order_amount"`
	DeliveryDays     DeliveryDays   `gorm:"type:json" json:"delivery_days"`
	DeliveryMode     DeliveryMode   `gorm:"type:enum('self_delivery','express_delivery')" json:"delivery_mode"`
	ManagementMode   ManagementMode `gorm:"type:enum('self','managed','webhook','api')" json:"management_mode"`
	HasBackend       int8           `gorm:"type:tinyint(1);default:1" json:"has_backend"`
	WechatWebhookURL *string        `gorm:"type:varchar(500)" json:"wechat_webhook_url"`
	WebhookEnabled   int8           `gorm:"type:tinyint(1);default:0" json:"webhook_enabled"`
	WebhookEvents    WebhookEvents  `gorm:"type:json" json:"webhook_events"`
	APIEndpoint      *string        `gorm:"type:varchar(500)" json:"api_endpoint"`
	APISecretKey     *string        `gorm:"type:varchar(100)" json:"-"` // Encrypted storage
	MarkupEnabled    int8           `gorm:"type:tinyint(1);default:1" json:"markup_enabled"`
	Remark           *string        `gorm:"type:text" json:"remark"`
	Status           int8           `gorm:"type:tinyint(1);default:1" json:"status"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User          *User            `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeliveryAreas []*DeliveryArea  `gorm:"foreignKey:SupplierID" json:"delivery_areas,omitempty"`
	Orders        []*Order         `gorm:"foreignKey:SupplierID" json:"orders,omitempty"`
	Materials     []*SupplierMaterial `gorm:"foreignKey:SupplierID" json:"materials,omitempty"`
}

// TableName specifies the table name for Supplier
func (Supplier) TableName() string {
	return "suppliers"
}

// BeforeCreate hook to set default values and generate supplier number
func (s *Supplier) BeforeCreate(tx *gorm.DB) error {
	if s.SupplierNo == "" {
		s.SupplierNo = generateSupplierNo()
	}
	if s.DisplayName == "" {
		s.DisplayName = s.Name
	}
	if s.Status == 0 {
		s.Status = 1
	}
	if s.HasBackend == 0 {
		s.HasBackend = 1
	}
	if s.MarkupEnabled == 0 {
		s.MarkupEnabled = 1
	}
	return nil
}

// generateSupplierNo generates a unique supplier number
func generateSupplierNo() string {
	// Format: SUP + timestamp (YYMMDDHHmmss) + random 4 digits
	return "SUP" + time.Now().Format("060102150405") + generateRandomDigits(4)
}

// IsActive checks if the supplier is active
func (s *Supplier) IsActive() bool {
	return s.Status == 1
}

// HasWebhook checks if webhook is enabled for the supplier
func (s *Supplier) HasWebhook() bool {
	return s.WebhookEnabled == 1 && s.WechatWebhookURL != nil && *s.WechatWebhookURL != ""
}

// HasAPI checks if API integration is enabled
func (s *Supplier) HasAPI() bool {
	return s.ManagementMode == ManagementAPI && s.APIEndpoint != nil && *s.APIEndpoint != ""
}

// IsDeliveryDay checks if a given weekday is a delivery day
func (s *Supplier) IsDeliveryDay(weekday int) bool {
	for _, day := range s.DeliveryDays {
		if day == weekday {
			return true
		}
	}
	return false
}

// GetNextDeliveryDay returns the next available delivery day
func (s *Supplier) GetNextDeliveryDay() *time.Time {
	if len(s.DeliveryDays) == 0 {
		return nil
	}

	now := time.Now()
	currentWeekday := int(now.Weekday())
	
	// Check remaining days this week
	for i := 0; i < 7; i++ {
		checkDay := (currentWeekday + i) % 7
		if s.IsDeliveryDay(checkDay) {
			nextDelivery := now.AddDate(0, 0, i)
			return &nextDelivery
		}
	}
	
	return nil
}

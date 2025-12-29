package types

import "time"

// MarkupType 加价类型枚举
type MarkupType string

const (
	MarkupFixed   MarkupType = "fixed"
	MarkupPercent MarkupType = "percent"
)

// SystemConfigInfo 系统配置信息
type SystemConfigInfo struct {
	ID          uint64    `json:"id"`
	ConfigKey   string    `json:"configKey"`
	ConfigValue string    `json:"configValue"`
	Description string    `json:"description,omitempty"`
	ConfigType  string    `json:"configType"`
	IsPublic    bool      `json:"isPublic"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// PriceMarkupInfo 加价规则信息
type PriceMarkupInfo struct {
	ID            uint64     `json:"id"`
	Name          string     `json:"name"`
	Description   string     `json:"description,omitempty"`
	MarkupType    MarkupType `json:"markupType"`
	MarkupValue   float64    `json:"markupValue"`
	Priority      int        `json:"priority"`
	SupplierID    *uint64    `json:"supplierId,omitempty"`
	CategoryID    *uint64    `json:"categoryId,omitempty"`
	MaterialSkuID *uint64    `json:"materialSkuId,omitempty"`
	StoreID       *uint64    `json:"storeId,omitempty"`
	StartTime     *time.Time `json:"startTime,omitempty"`
	EndTime       *time.Time `json:"endTime,omitempty"`
	Status        int8       `json:"status"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}

// DeliveryAreaInfo 配送区域信息
type DeliveryAreaInfo struct {
	ID         uint64 `json:"id"`
	SupplierID uint64 `json:"supplierId"`
	Province   string `json:"province"`
	City       string `json:"city"`
	District   string `json:"district,omitempty"`
	Status     int8   `json:"status"`
}

// CreatePriceMarkupRequest 创建加价规则请求
type CreatePriceMarkupRequest struct {
	Name          string     `json:"name" validate:"required,max=100"`
	Description   string     `json:"description" validate:"max=500"`
	MarkupType    MarkupType `json:"markupType" validate:"required,oneof=fixed percent"`
	MarkupValue   float64    `json:"markupValue" validate:"required,gt=0"`
	Priority      int        `json:"priority"`
	SupplierID    *uint64    `json:"supplierId"`
	CategoryID    *uint64    `json:"categoryId"`
	MaterialSkuID *uint64    `json:"materialSkuId"`
	StoreID       *uint64    `json:"storeId"`
	StartTime     *time.Time `json:"startTime"`
	EndTime       *time.Time `json:"endTime"`
}

// UpdatePriceMarkupRequest 更新加价规则请求
type UpdatePriceMarkupRequest struct {
	Name        string     `json:"name" validate:"max=100"`
	Description string     `json:"description" validate:"max=500"`
	MarkupType  MarkupType `json:"markupType" validate:"omitempty,oneof=fixed percent"`
	MarkupValue float64    `json:"markupValue" validate:"omitempty,gt=0"`
	Priority    int        `json:"priority"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
	Status      *int8      `json:"status"`
}

// CreateDeliveryAreaRequest 创建配送区域请求
type CreateDeliveryAreaRequest struct {
	Province string `json:"province" validate:"required,max=50"`
	City     string `json:"city" validate:"required,max=50"`
	District string `json:"district" validate:"max=50"`
}

// UpdateSystemConfigRequest 更新系统配置请求
type UpdateSystemConfigRequest struct {
	ConfigValue string `json:"configValue" validate:"required"`
}

// SystemConfigKeys 系统配置键常量
const (
	ConfigServiceFeeRate        = "service_fee_rate"
	ConfigWebhookRetryTimes     = "webhook_retry_times"
	ConfigWebhookRetryInterval  = "webhook_retry_interval"
	ConfigOrderAutoConfirmHours = "order_auto_confirm_hours"
	ConfigOrderCancelDeadline   = "order_cancel_deadline"
)

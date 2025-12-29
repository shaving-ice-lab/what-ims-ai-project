package models

import (
	"time"

	"gorm.io/gorm"
)

// ConfigType 配置类型
type ConfigType string

const (
	ConfigTypeString  ConfigType = "string"
	ConfigTypeNumber  ConfigType = "number"
	ConfigTypeBoolean ConfigType = "boolean"
	ConfigTypeJSON    ConfigType = "json"
)

// 系统配置键常量
const (
	ConfigKeyOrderCancelThreshold  = "order_cancel_threshold"
	ConfigKeyPaymentTimeout        = "payment_timeout"
	ConfigKeyServiceFeeRate        = "service_fee_rate"
	ConfigKeyWebhookRetryTimes     = "webhook_retry_times"
	ConfigKeyWebhookRetryInterval  = "webhook_retry_interval"
)

// SystemConfig 系统配置表
type SystemConfig struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	ConfigKey   string         `gorm:"type:varchar(100);uniqueIndex:uk_config_key;not null" json:"configKey"`
	ConfigValue string         `gorm:"type:text" json:"configValue"`
	ConfigType  ConfigType     `gorm:"type:enum('string','number','boolean','json')" json:"configType"`
	Description string         `gorm:"type:varchar(500)" json:"description,omitempty"`
	IsSensitive bool           `gorm:"default:false" json:"isSensitive"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 表名
func (SystemConfig) TableName() string {
	return "system_configs"
}

// DefaultConfigs 默认系统配置
var DefaultConfigs = []SystemConfig{
	{
		ConfigKey:   ConfigKeyOrderCancelThreshold,
		ConfigValue: "60",
		ConfigType:  ConfigTypeNumber,
		Description: "订单自主取消时间阈值（分钟）",
	},
	{
		ConfigKey:   ConfigKeyPaymentTimeout,
		ConfigValue: "15",
		ConfigType:  ConfigTypeNumber,
		Description: "支付超时时间（分钟）",
	},
	{
		ConfigKey:   ConfigKeyServiceFeeRate,
		ConfigValue: "0.003",
		ConfigType:  ConfigTypeNumber,
		Description: "服务费费率",
	},
	{
		ConfigKey:   ConfigKeyWebhookRetryTimes,
		ConfigValue: "3",
		ConfigType:  ConfigTypeNumber,
		Description: "Webhook最大重试次数",
	},
	{
		ConfigKey:   ConfigKeyWebhookRetryInterval,
		ConfigValue: "5",
		ConfigType:  ConfigTypeNumber,
		Description: "Webhook重试间隔（分钟）",
	},
}

// InitDefaultConfigs 初始化默认配置
func InitDefaultConfigs(db *gorm.DB) error {
	for _, config := range DefaultConfigs {
		var existing SystemConfig
		result := db.Where("config_key = ?", config.ConfigKey).First(&existing)
		if result.Error == gorm.ErrRecordNotFound {
			if err := db.Create(&config).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

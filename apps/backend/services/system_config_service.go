package services

import (
	"strconv"
	"time"

	"gorm.io/gorm"
)

// SystemConfigService 系统配置服务
type SystemConfigService struct {
	db *gorm.DB
}

// NewSystemConfigService 创建系统配置服务
func NewSystemConfigService(db *gorm.DB) *SystemConfigService {
	return &SystemConfigService{db: db}
}

// SystemConfig 系统配置项
type SystemConfig struct {
	ID          uint64    `json:"id"`
	ConfigKey   string    `json:"configKey"`
	ConfigValue string    `json:"configValue"`
	ConfigType  string    `json:"configType"` // string, number, boolean, json
	Description string    `json:"description"`
	Module      string    `json:"module"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// PaymentConfig 支付配置
type PaymentConfig struct {
	WechatEnabled    bool   `json:"wechatEnabled"`
	WechatAppID      string `json:"wechatAppId"`
	WechatMchID      string `json:"wechatMchId"`
	WechatApiKey     string `json:"wechatApiKey"` // 加密存储
	WechatNotifyURL  string `json:"wechatNotifyUrl"`
	AlipayEnabled    bool   `json:"alipayEnabled"`
	AlipayAppID      string `json:"alipayAppId"`
	AlipayPrivateKey string `json:"alipayPrivateKey"` // 加密存储
	AlipayPublicKey  string `json:"alipayPublicKey"`
	AlipayNotifyURL  string `json:"alipayNotifyUrl"`
}

// APIConfig API配置
type APIConfig struct {
	SupplierWebhookURL string `json:"supplierWebhookUrl"`
	APIKeyPrefix       string `json:"apiKeyPrefix"`
	RateLimitPerMin    int    `json:"rateLimitPerMin"`
}

// OrderConfig 订单配置
type OrderConfig struct {
	CancelTimeThreshold int     `json:"cancelTimeThreshold"` // 分钟
	PaymentTimeout      int     `json:"paymentTimeout"`      // 分钟
	ServiceFeeRate      float64 `json:"serviceFeeRate"`      // 服务费率
	MinServiceFee       float64 `json:"minServiceFee"`       // 最低服务费
}

// DeliveryNoteTemplate 送货单模板
type DeliveryNoteTemplate struct {
	ID        uint64    `json:"id"`
	Name      string    `json:"name"`
	Content   string    `json:"content"` // HTML模板
	IsDefault bool      `json:"isDefault"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// GetConfig 获取配置
func (s *SystemConfigService) GetConfig(key string) (string, error) {
	var config SystemConfig
	err := s.db.Table("system_configs").Where("config_key = ?", key).First(&config).Error
	if err != nil {
		return "", err
	}
	return config.ConfigValue, nil
}

// SetConfig 设置配置
func (s *SystemConfigService) SetConfig(key, value, configType, description, module string) error {
	var existing SystemConfig
	err := s.db.Table("system_configs").Where("config_key = ?", key).First(&existing).Error
	if err == gorm.ErrRecordNotFound {
		return s.db.Table("system_configs").Create(map[string]interface{}{
			"config_key":   key,
			"config_value": value,
			"config_type":  configType,
			"description":  description,
			"module":       module,
			"created_at":   time.Now(),
			"updated_at":   time.Now(),
		}).Error
	}
	return s.db.Table("system_configs").Where("config_key = ?", key).Updates(map[string]interface{}{
		"config_value": value,
		"updated_at":   time.Now(),
	}).Error
}

// GetConfigsByModule 按模块获取配置
func (s *SystemConfigService) GetConfigsByModule(module string) ([]SystemConfig, error) {
	var configs []SystemConfig
	err := s.db.Table("system_configs").Where("module = ?", module).Find(&configs).Error
	return configs, err
}

// GetPaymentConfig 获取支付配置
func (s *SystemConfigService) GetPaymentConfig() (*PaymentConfig, error) {
	config := &PaymentConfig{}
	// 从system_configs表读取各项配置
	configs, err := s.GetConfigsByModule("payment")
	if err != nil {
		return nil, err
	}
	for _, c := range configs {
		switch c.ConfigKey {
		case "wechat_enabled":
			config.WechatEnabled = c.ConfigValue == "true"
		case "wechat_appid":
			config.WechatAppID = c.ConfigValue
		case "wechat_mchid":
			config.WechatMchID = c.ConfigValue
		case "wechat_notify_url":
			config.WechatNotifyURL = c.ConfigValue
		case "alipay_enabled":
			config.AlipayEnabled = c.ConfigValue == "true"
		case "alipay_appid":
			config.AlipayAppID = c.ConfigValue
		case "alipay_notify_url":
			config.AlipayNotifyURL = c.ConfigValue
		}
	}
	return config, nil
}

// SavePaymentConfig 保存支付配置
func (s *SystemConfigService) SavePaymentConfig(config *PaymentConfig) error {
	configs := map[string]string{
		"wechat_enabled":    boolToStr(config.WechatEnabled),
		"wechat_appid":      config.WechatAppID,
		"wechat_mchid":      config.WechatMchID,
		"wechat_notify_url": config.WechatNotifyURL,
		"alipay_enabled":    boolToStr(config.AlipayEnabled),
		"alipay_appid":      config.AlipayAppID,
		"alipay_notify_url": config.AlipayNotifyURL,
	}
	for key, value := range configs {
		if err := s.SetConfig(key, value, "string", "", "payment"); err != nil {
			return err
		}
	}
	return nil
}

// GetOrderConfig 获取订单配置
func (s *SystemConfigService) GetOrderConfig() (*OrderConfig, error) {
	config := &OrderConfig{
		CancelTimeThreshold: 60,
		PaymentTimeout:      30,
		ServiceFeeRate:      0.03,
		MinServiceFee:       1.0,
	}

	// 从数据库读取配置
	if val, err := s.GetConfig("order_cancel_time_threshold"); err == nil && val != "" {
		if v, e := strconv.Atoi(val); e == nil {
			config.CancelTimeThreshold = v
		}
	}
	if val, err := s.GetConfig("order_payment_timeout"); err == nil && val != "" {
		if v, e := strconv.Atoi(val); e == nil {
			config.PaymentTimeout = v
		}
	}
	if val, err := s.GetConfig("order_service_fee_rate"); err == nil && val != "" {
		if v, e := strconv.ParseFloat(val, 64); e == nil {
			config.ServiceFeeRate = v
		}
	}
	if val, err := s.GetConfig("order_min_service_fee"); err == nil && val != "" {
		if v, e := strconv.ParseFloat(val, 64); e == nil {
			config.MinServiceFee = v
		}
	}

	return config, nil
}

// SaveOrderConfig 保存订单配置
func (s *SystemConfigService) SaveOrderConfig(config *OrderConfig) error {
	// 保存到数据库
	configs := map[string]string{
		"order_cancel_time_threshold": strconv.Itoa(config.CancelTimeThreshold),
		"order_payment_timeout":       strconv.Itoa(config.PaymentTimeout),
		"order_service_fee_rate":      strconv.FormatFloat(config.ServiceFeeRate, 'f', 4, 64),
		"order_min_service_fee":       strconv.FormatFloat(config.MinServiceFee, 'f', 2, 64),
	}
	for key, value := range configs {
		if err := s.SetConfig(key, value, "string", "", "order"); err != nil {
			return err
		}
	}
	return nil
}

// ListDeliveryNoteTemplates 获取送货单模板列表
func (s *SystemConfigService) ListDeliveryNoteTemplates() ([]DeliveryNoteTemplate, error) {
	var templates []DeliveryNoteTemplate
	err := s.db.Table("delivery_note_templates").Order("created_at DESC").Find(&templates).Error
	return templates, err
}

// CreateDeliveryNoteTemplate 创建送货单模板
func (s *SystemConfigService) CreateDeliveryNoteTemplate(name, content string, isDefault bool) error {
	if isDefault {
		s.db.Table("delivery_note_templates").Where("is_default = ?", true).Update("is_default", false)
	}
	return s.db.Table("delivery_note_templates").Create(map[string]interface{}{
		"name":       name,
		"content":    content,
		"is_default": isDefault,
		"created_at": time.Now(),
		"updated_at": time.Now(),
	}).Error
}

// UpdateDeliveryNoteTemplate 更新送货单模板
func (s *SystemConfigService) UpdateDeliveryNoteTemplate(id uint64, name, content string, isDefault bool) error {
	if isDefault {
		s.db.Table("delivery_note_templates").Where("is_default = ? AND id != ?", true, id).Update("is_default", false)
	}
	return s.db.Table("delivery_note_templates").Where("id = ?", id).Updates(map[string]interface{}{
		"name":       name,
		"content":    content,
		"is_default": isDefault,
		"updated_at": time.Now(),
	}).Error
}

// DeleteDeliveryNoteTemplate 删除送货单模板
func (s *SystemConfigService) DeleteDeliveryNoteTemplate(id uint64) error {
	return s.db.Table("delivery_note_templates").Where("id = ?", id).Delete(nil).Error
}

// AssignTemplateToSupplier 为供应商分配模板
func (s *SystemConfigService) AssignTemplateToSupplier(supplierID, templateID uint64) error {
	return s.db.Table("suppliers").Where("id = ?", supplierID).Update("delivery_note_template_id", templateID).Error
}

func boolToStr(b bool) string {
	if b {
		return "true"
	}
	return "false"
}

package services

import (
	"time"

	"gorm.io/gorm"
)

// SupplierProxyService 供应商代管服务
type SupplierProxyService struct {
	db *gorm.DB
}

// NewSupplierProxyService 创建供应商代管服务
func NewSupplierProxyService(db *gorm.DB) *SupplierProxyService {
	return &SupplierProxyService{db: db}
}

// ProxySupplier 代管供应商信息
type ProxySupplier struct {
	ID            uint64 `json:"id"`
	Name          string `json:"name"`
	DisplayName   string `json:"displayName"`
	ContactPerson string `json:"contactPerson"`
	Phone         string `json:"phone"`
	ProductCount  int64  `json:"productCount"`
	OrderCount    int64  `json:"orderCount"`
}

// ProxyOperationLog 代管操作日志
type ProxyOperationLog struct {
	ID           uint64    `gorm:"primaryKey" json:"id"`
	SupplierID   uint64    `gorm:"not null;index" json:"supplierId"`
	OperatorID   uint64    `gorm:"not null" json:"operatorId"`
	OperatorName string    `gorm:"type:varchar(50)" json:"operatorName"`
	Operation    string    `gorm:"type:varchar(50);not null" json:"operation"`
	TargetType   string    `gorm:"type:varchar(50)" json:"targetType"`
	TargetID     uint64    `json:"targetId"`
	OldValue     string    `gorm:"type:text" json:"oldValue"`
	NewValue     string    `gorm:"type:text" json:"newValue"`
	Remark       string    `gorm:"type:varchar(500)" json:"remark"`
	CreatedAt    time.Time `json:"createdAt"`
}

// TableName 表名
func (ProxyOperationLog) TableName() string {
	return "proxy_operation_logs"
}

// GetProxySuppliers 获取代管供应商列表
func (s *SupplierProxyService) GetProxySuppliers(page, pageSize int) ([]ProxySupplier, int64, error) {
	var suppliers []ProxySupplier
	var total int64

	query := s.db.Table("suppliers s").
		Select(`
			s.id,
			s.name,
			s.display_name,
			s.contact_person,
			s.phone,
			(SELECT COUNT(*) FROM supplier_materials WHERE supplier_id = s.id AND status = 'approved') as product_count,
			(SELECT COUNT(*) FROM orders WHERE supplier_id = s.id) as order_count
		`).
		Where("s.manage_mode = ?", "platform_managed")

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&suppliers).Error
	return suppliers, total, err
}

// ProxySetMaterialPrice 代管设置物料价格
func (s *SupplierProxyService) ProxySetMaterialPrice(supplierID uint64, materialSkuID uint64, price float64, minQuantity int, operatorID uint64, operatorName string) error {
	// 获取旧值
	var oldPrice float64
	s.db.Table("supplier_materials").
		Select("price").
		Where("supplier_id = ? AND material_sku_id = ?", supplierID, materialSkuID).
		Scan(&oldPrice)

	// 更新价格
	result := s.db.Table("supplier_materials").
		Where("supplier_id = ? AND material_sku_id = ?", supplierID, materialSkuID).
		Updates(map[string]interface{}{
			"price":        price,
			"min_quantity": minQuantity,
		})

	if result.Error != nil {
		return result.Error
	}

	// 记录操作日志
	s.logOperation(supplierID, operatorID, operatorName, "set_price", "material", materialSkuID,
		formatFloat(oldPrice), formatFloat(price), "代管设置物料价格")

	return nil
}

// ProxySetDeliverySetting 代管设置配送设置
func (s *SupplierProxyService) ProxySetDeliverySetting(supplierID uint64, minOrderAmount float64, deliveryDays string, operatorID uint64, operatorName string) error {
	// 获取旧值
	var oldSetting struct {
		MinOrderAmount float64
		DeliveryDays   string
	}
	s.db.Table("delivery_settings").
		Select("min_order_amount, delivery_days").
		Where("supplier_id = ?", supplierID).
		Scan(&oldSetting)

	// 更新或创建设置
	result := s.db.Table("delivery_settings").
		Where("supplier_id = ?", supplierID).
		Updates(map[string]interface{}{
			"min_order_amount": minOrderAmount,
			"delivery_days":    deliveryDays,
			"audit_status":     "approved", // 代管设置直接生效
		})

	if result.RowsAffected == 0 {
		s.db.Table("delivery_settings").Create(map[string]interface{}{
			"supplier_id":      supplierID,
			"min_order_amount": minOrderAmount,
			"delivery_days":    deliveryDays,
			"audit_status":     "approved",
		})
	}

	// 记录操作日志
	s.logOperation(supplierID, operatorID, operatorName, "set_delivery", "delivery_setting", 0,
		formatFloat(oldSetting.MinOrderAmount)+","+oldSetting.DeliveryDays,
		formatFloat(minOrderAmount)+","+deliveryDays, "代管设置配送设置")

	return nil
}

// ProxyAddDeliveryArea 代管添加配送区域
func (s *SupplierProxyService) ProxyAddDeliveryArea(supplierID uint64, province, city, district string, operatorID uint64, operatorName string) error {
	// 创建配送区域（直接生效）
	err := s.db.Table("delivery_areas").Create(map[string]interface{}{
		"supplier_id":  supplierID,
		"province":     province,
		"city":         city,
		"district":     district,
		"audit_status": "approved",
	}).Error

	if err != nil {
		return err
	}

	// 记录操作日志
	s.logOperation(supplierID, operatorID, operatorName, "add_delivery_area", "delivery_area", 0,
		"", province+city+district, "代管添加配送区域")

	return nil
}

// ProxyConfirmOrder 代管确认订单
func (s *SupplierProxyService) ProxyConfirmOrder(supplierID uint64, orderID uint64, operatorID uint64, operatorName string) error {
	// 更新订单状态
	result := s.db.Table("orders").
		Where("id = ? AND supplier_id = ? AND status = ?", orderID, supplierID, "pending_confirm").
		Update("status", "confirmed")

	if result.Error != nil {
		return result.Error
	}

	// 记录操作日志
	s.logOperation(supplierID, operatorID, operatorName, "confirm_order", "order", orderID,
		"pending_confirm", "confirmed", "代管确认订单")

	// 记录订单状态日志
	s.db.Table("order_status_logs").Create(map[string]interface{}{
		"order_id":    orderID,
		"from_status": "pending_confirm",
		"to_status":   "confirmed",
		"operator_id": operatorID,
		"remark":      "平台代管确认",
		"created_at":  time.Now(),
	})

	return nil
}

// ProxyUpdateOrderStatus 代管更新订单状态
func (s *SupplierProxyService) ProxyUpdateOrderStatus(supplierID uint64, orderID uint64, newStatus string, operatorID uint64, operatorName string) error {
	// 获取当前状态
	var currentStatus string
	s.db.Table("orders").Select("status").Where("id = ?", orderID).Scan(&currentStatus)

	// 更新订单状态
	result := s.db.Table("orders").
		Where("id = ? AND supplier_id = ?", orderID, supplierID).
		Update("status", newStatus)

	if result.Error != nil {
		return result.Error
	}

	// 记录操作日志
	s.logOperation(supplierID, operatorID, operatorName, "update_order_status", "order", orderID,
		currentStatus, newStatus, "代管更新订单状态")

	// 记录订单状态日志
	s.db.Table("order_status_logs").Create(map[string]interface{}{
		"order_id":    orderID,
		"from_status": currentStatus,
		"to_status":   newStatus,
		"operator_id": operatorID,
		"remark":      "平台代管操作",
		"created_at":  time.Now(),
	})

	return nil
}

// GetProxyOperationLogs 获取代管操作日志
func (s *SupplierProxyService) GetProxyOperationLogs(supplierID uint64, page, pageSize int) ([]ProxyOperationLog, int64, error) {
	var logs []ProxyOperationLog
	var total int64

	query := s.db.Model(&ProxyOperationLog{}).Where("supplier_id = ?", supplierID)
	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&logs).Error
	return logs, total, err
}

// logOperation 记录代管操作日志
func (s *SupplierProxyService) logOperation(supplierID, operatorID uint64, operatorName, operation, targetType string, targetID uint64, oldValue, newValue, remark string) {
	s.db.Create(&ProxyOperationLog{
		SupplierID:   supplierID,
		OperatorID:   operatorID,
		OperatorName: operatorName,
		Operation:    operation,
		TargetType:   targetType,
		TargetID:     targetID,
		OldValue:     oldValue,
		NewValue:     newValue,
		Remark:       remark,
		CreatedAt:    time.Now(),
	})
}

func formatFloat(f float64) string {
	return string(rune(int(f*100))) // 简单格式化
}

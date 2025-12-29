package services

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// DeliverySettingService 配送设置服务
type DeliverySettingService struct {
	db *gorm.DB
}

// NewDeliverySettingService 创建配送设置服务
func NewDeliverySettingService(db *gorm.DB) *DeliverySettingService {
	return &DeliverySettingService{db: db}
}

// AuditStatus 审核状态
type AuditStatus string

const (
	AuditStatusPending  AuditStatus = "pending"
	AuditStatusApproved AuditStatus = "approved"
	AuditStatusRejected AuditStatus = "rejected"
)

// DeliverySetting 配送设置模型
type DeliverySetting struct {
	ID              uint64      `gorm:"primaryKey" json:"id"`
	SupplierID      uint64      `gorm:"not null;uniqueIndex" json:"supplierId"`
	MinOrderAmount  float64     `gorm:"type:decimal(10,2);not null" json:"minOrderAmount"` // 起送价
	DeliveryDays    string      `gorm:"type:varchar(50)" json:"deliveryDays"`              // 配送日（逗号分隔，如"1,2,3,4,5"）
	AuditStatus     AuditStatus `gorm:"type:varchar(20);default:pending" json:"auditStatus"`
	RejectReason    string      `gorm:"type:varchar(500)" json:"rejectReason"`
	SubmittedAt     *time.Time  `json:"submittedAt"`
	AuditedAt       *time.Time  `json:"auditedAt"`
	AuditedBy       uint64      `json:"auditedBy"`
	CreatedAt       time.Time   `json:"createdAt"`
	UpdatedAt       time.Time   `json:"updatedAt"`
}

// TableName 表名
func (DeliverySetting) TableName() string {
	return "delivery_settings"
}

// DeliveryArea 配送区域模型
type DeliveryArea struct {
	ID          uint64      `gorm:"primaryKey" json:"id"`
	SupplierID  uint64      `gorm:"not null;index" json:"supplierId"`
	Province    string      `gorm:"type:varchar(50);not null" json:"province"`
	City        string      `gorm:"type:varchar(50)" json:"city"`
	District    string      `gorm:"type:varchar(50)" json:"district"`
	AuditStatus AuditStatus `gorm:"type:varchar(20);default:pending" json:"auditStatus"`
	CreatedAt   time.Time   `json:"createdAt"`
	UpdatedAt   time.Time   `json:"updatedAt"`
}

// TableName 表名
func (DeliveryArea) TableName() string {
	return "delivery_areas"
}

// Waybill 运单模型
type Waybill struct {
	ID          uint64    `gorm:"primaryKey" json:"id"`
	SupplierID  uint64    `gorm:"not null;index" json:"supplierId"`
	OrderID     uint64    `gorm:"not null;index" json:"orderId"`
	WaybillNo   string    `gorm:"type:varchar(50);not null" json:"waybillNo"`
	Carrier     string    `gorm:"type:varchar(50)" json:"carrier"` // 物流公司
	Status      string    `gorm:"type:varchar(20);default:created" json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// TableName 表名
func (Waybill) TableName() string {
	return "waybills"
}

// UpdateDeliverySettingRequest 更新配送设置请求
type UpdateDeliverySettingRequest struct {
	MinOrderAmount float64 `json:"minOrderAmount" validate:"required,gt=0"`
	DeliveryDays   string  `json:"deliveryDays" validate:"required"`
}

// AddDeliveryAreaRequest 添加配送区域请求
type AddDeliveryAreaRequest struct {
	Province string `json:"province" validate:"required"`
	City     string `json:"city"`
	District string `json:"district"`
}

// BatchAddDeliveryAreaRequest 批量添加配送区域请求
type BatchAddDeliveryAreaRequest struct {
	Areas []AddDeliveryAreaRequest `json:"areas" validate:"required,min=1"`
}

// CreateWaybillRequest 创建运单请求
type CreateWaybillRequest struct {
	OrderID   uint64 `json:"orderId" validate:"required"`
	WaybillNo string `json:"waybillNo" validate:"required"`
	Carrier   string `json:"carrier"`
}

// GetDeliverySetting 获取配送设置
func (s *DeliverySettingService) GetDeliverySetting(supplierID uint64) (*DeliverySetting, error) {
	var setting DeliverySetting
	err := s.db.Where("supplier_id = ?", supplierID).First(&setting).Error
	if err == gorm.ErrRecordNotFound {
		// 返回默认设置
		return &DeliverySetting{
			SupplierID:     supplierID,
			MinOrderAmount: 0,
			DeliveryDays:   "1,2,3,4,5",
			AuditStatus:    AuditStatusApproved,
		}, nil
	}
	return &setting, err
}

// UpdateDeliverySetting 更新配送设置（提交审核）
func (s *DeliverySettingService) UpdateDeliverySetting(supplierID uint64, req *UpdateDeliverySettingRequest) (*DeliverySetting, error) {
	var setting DeliverySetting
	err := s.db.Where("supplier_id = ?", supplierID).First(&setting).Error

	now := time.Now()
	if err == gorm.ErrRecordNotFound {
		// 创建新设置
		setting = DeliverySetting{
			SupplierID:     supplierID,
			MinOrderAmount: req.MinOrderAmount,
			DeliveryDays:   req.DeliveryDays,
			AuditStatus:    AuditStatusPending,
			SubmittedAt:    &now,
		}
		if err := s.db.Create(&setting).Error; err != nil {
			return nil, err
		}
	} else {
		// 更新设置
		setting.MinOrderAmount = req.MinOrderAmount
		setting.DeliveryDays = req.DeliveryDays
		setting.AuditStatus = AuditStatusPending
		setting.SubmittedAt = &now
		setting.RejectReason = ""
		if err := s.db.Save(&setting).Error; err != nil {
			return nil, err
		}
	}

	return &setting, nil
}

// AuditDeliverySetting 审核配送设置（管理员）
func (s *DeliverySettingService) AuditDeliverySetting(settingID uint64, approved bool, rejectReason string, auditorID uint64) error {
	var setting DeliverySetting
	if err := s.db.First(&setting, settingID).Error; err != nil {
		return err
	}

	now := time.Now()
	setting.AuditedAt = &now
	setting.AuditedBy = auditorID

	if approved {
		setting.AuditStatus = AuditStatusApproved
		setting.RejectReason = ""
	} else {
		setting.AuditStatus = AuditStatusRejected
		setting.RejectReason = rejectReason
	}

	return s.db.Save(&setting).Error
}

// GetDeliveryAreas 获取配送区域列表
func (s *DeliverySettingService) GetDeliveryAreas(supplierID uint64) ([]DeliveryArea, error) {
	var areas []DeliveryArea
	err := s.db.Where("supplier_id = ?", supplierID).Order("province, city, district").Find(&areas).Error
	return areas, err
}

// AddDeliveryArea 添加配送区域
func (s *DeliverySettingService) AddDeliveryArea(supplierID uint64, req *AddDeliveryAreaRequest) (*DeliveryArea, error) {
	// 检查是否已存在
	var existing DeliveryArea
	err := s.db.Where("supplier_id = ? AND province = ? AND city = ? AND district = ?",
		supplierID, req.Province, req.City, req.District).First(&existing).Error
	if err == nil {
		return nil, errors.New("配送区域已存在")
	}

	area := DeliveryArea{
		SupplierID:  supplierID,
		Province:    req.Province,
		City:        req.City,
		District:    req.District,
		AuditStatus: AuditStatusPending,
	}

	if err := s.db.Create(&area).Error; err != nil {
		return nil, err
	}
	return &area, nil
}

// BatchAddDeliveryAreas 批量添加配送区域
func (s *DeliverySettingService) BatchAddDeliveryAreas(supplierID uint64, req *BatchAddDeliveryAreaRequest) ([]DeliveryArea, error) {
	var areas []DeliveryArea

	for _, areaReq := range req.Areas {
		area := DeliveryArea{
			SupplierID:  supplierID,
			Province:    areaReq.Province,
			City:        areaReq.City,
			District:    areaReq.District,
			AuditStatus: AuditStatusPending,
		}
		areas = append(areas, area)
	}

	if err := s.db.Create(&areas).Error; err != nil {
		return nil, err
	}
	return areas, nil
}

// DeleteDeliveryArea 删除配送区域
func (s *DeliverySettingService) DeleteDeliveryArea(supplierID uint64, areaID uint64) error {
	result := s.db.Where("id = ? AND supplier_id = ?", areaID, supplierID).Delete(&DeliveryArea{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("配送区域不存在")
	}
	return nil
}

// GetWaybills 获取运单列表
func (s *DeliverySettingService) GetWaybills(supplierID uint64, page, pageSize int) ([]Waybill, int64, error) {
	var waybills []Waybill
	var total int64

	query := s.db.Model(&Waybill{}).Where("supplier_id = ?", supplierID)
	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&waybills).Error
	return waybills, total, err
}

// CreateWaybill 创建运单
func (s *DeliverySettingService) CreateWaybill(supplierID uint64, req *CreateWaybillRequest) (*Waybill, error) {
	waybill := Waybill{
		SupplierID: supplierID,
		OrderID:    req.OrderID,
		WaybillNo:  req.WaybillNo,
		Carrier:    req.Carrier,
		Status:     "created",
	}

	if err := s.db.Create(&waybill).Error; err != nil {
		return nil, err
	}

	// 更新订单状态为配送中
	s.db.Table("orders").Where("id = ?", req.OrderID).Update("status", "delivering")

	return &waybill, nil
}

// GetWaybillByOrder 根据订单获取运单
func (s *DeliverySettingService) GetWaybillByOrder(orderID uint64) (*Waybill, error) {
	var waybill Waybill
	err := s.db.Where("order_id = ?", orderID).First(&waybill).Error
	return &waybill, err
}

// GetPendingAuditSettings 获取待审核的配送设置列表（管理员）
func (s *DeliverySettingService) GetPendingAuditSettings(page, pageSize int) ([]map[string]interface{}, int64, error) {
	var results []map[string]interface{}
	var total int64

	query := s.db.Table("delivery_settings ds").
		Select(`
			ds.id,
			ds.supplier_id,
			s.name as supplier_name,
			ds.min_order_amount,
			ds.delivery_days,
			ds.audit_status,
			ds.submitted_at
		`).
		Joins("JOIN suppliers s ON s.id = ds.supplier_id").
		Where("ds.audit_status = ?", AuditStatusPending)

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("ds.submitted_at DESC").Offset(offset).Limit(pageSize).Scan(&results).Error
	return results, total, err
}

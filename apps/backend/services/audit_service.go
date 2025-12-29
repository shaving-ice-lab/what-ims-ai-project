package services

import (
	"time"

	"gorm.io/gorm"
)

// AuditService 审核服务
type AuditService struct {
	db *gorm.DB
}

// NewAuditService 创建审核服务
func NewAuditService(db *gorm.DB) *AuditService {
	return &AuditService{db: db}
}

// DeliverySettingAudit 配送设置审核项
type DeliverySettingAudit struct {
	ID             uint64    `json:"id"`
	SupplierID     uint64    `json:"supplierId"`
	SupplierName   string    `json:"supplierName"`
	ChangeType     string    `json:"changeType"`
	OldValue       string    `json:"oldValue"`
	NewValue       string    `json:"newValue"`
	SubmittedAt    time.Time `json:"submittedAt"`
	Status         string    `json:"status"`
}

// ProductAudit 产品审核项
type ProductAudit struct {
	ID             uint64    `json:"id"`
	SupplierID     uint64    `json:"supplierId"`
	SupplierName   string    `json:"supplierName"`
	MaterialSkuID  uint64    `json:"materialSkuId"`
	MaterialName   string    `json:"materialName"`
	Brand          string    `json:"brand"`
	Spec           string    `json:"spec"`
	Price          float64   `json:"price"`
	SubmittedAt    time.Time `json:"submittedAt"`
	Status         string    `json:"status"`
	RejectReason   string    `json:"rejectReason"`
}

// AuditHistory 审核历史
type AuditHistory struct {
	ID          uint64    `json:"id"`
	AuditType   string    `json:"auditType"`
	TargetID    uint64    `json:"targetId"`
	Action      string    `json:"action"`
	Reason      string    `json:"reason"`
	AuditorID   uint64    `json:"auditorId"`
	AuditorName string    `json:"auditorName"`
	CreatedAt   time.Time `json:"createdAt"`
}

// GetPendingDeliveryAudits 获取待审核配送设置列表
func (s *AuditService) GetPendingDeliveryAudits(page, pageSize int) ([]DeliverySettingAudit, int64, error) {
	var audits []DeliverySettingAudit
	var total int64

	query := s.db.Table("delivery_settings ds").
		Select(`
			ds.id,
			ds.supplier_id,
			sp.name as supplier_name,
			'delivery_setting' as change_type,
			CONCAT(ds.min_order_amount, ',', ds.delivery_days) as new_value,
			ds.submitted_at,
			ds.audit_status as status
		`).
		Joins("JOIN suppliers sp ON sp.id = ds.supplier_id").
		Where("ds.audit_status = ?", "pending")

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("ds.submitted_at DESC").Offset(offset).Limit(pageSize).Scan(&audits).Error
	return audits, total, err
}

// AuditDeliverySetting 审核配送设置
func (s *AuditService) AuditDeliverySetting(id uint64, approved bool, reason string, auditorID uint64) error {
	status := "approved"
	if !approved {
		status = "rejected"
	}

	updates := map[string]interface{}{
		"audit_status": status,
		"audited_at":   time.Now(),
		"audited_by":   auditorID,
	}
	if !approved {
		updates["reject_reason"] = reason
	}

	return s.db.Table("delivery_settings").Where("id = ?", id).Updates(updates).Error
}

// GetPendingProductAudits 获取待审核产品列表
func (s *AuditService) GetPendingProductAudits(page, pageSize int, supplierID *uint64, status string) ([]ProductAudit, int64, error) {
	var audits []ProductAudit
	var total int64

	query := s.db.Table("supplier_materials sm").
		Select(`
			sm.id,
			sm.supplier_id,
			sp.name as supplier_name,
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			sm.price,
			sm.created_at as submitted_at,
			sm.status,
			sm.reject_reason
		`).
		Joins("JOIN suppliers sp ON sp.id = sm.supplier_id").
		Joins("JOIN material_skus ms ON ms.id = sm.material_sku_id")

	if status == "" {
		query = query.Where("sm.status = ?", "pending")
	} else {
		query = query.Where("sm.status = ?", status)
	}

	if supplierID != nil {
		query = query.Where("sm.supplier_id = ?", *supplierID)
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("sm.created_at DESC").Offset(offset).Limit(pageSize).Scan(&audits).Error
	return audits, total, err
}

// AuditProduct 审核产品
func (s *AuditService) AuditProduct(id uint64, approved bool, reason string, auditorID uint64) error {
	status := "approved"
	if !approved {
		status = "rejected"
	}

	updates := map[string]interface{}{
		"status":     status,
		"audited_at": time.Now(),
		"audited_by": auditorID,
	}
	if !approved {
		updates["reject_reason"] = reason
	}

	return s.db.Table("supplier_materials").Where("id = ?", id).Updates(updates).Error
}

// BatchAuditProducts 批量审核产品
func (s *AuditService) BatchAuditProducts(ids []uint64, approved bool, reason string, auditorID uint64) error {
	status := "approved"
	if !approved {
		status = "rejected"
	}

	updates := map[string]interface{}{
		"status":     status,
		"audited_at": time.Now(),
		"audited_by": auditorID,
	}
	if !approved {
		updates["reject_reason"] = reason
	}

	return s.db.Table("supplier_materials").Where("id IN ?", ids).Updates(updates).Error
}

// GetAuditHistory 获取审核历史
func (s *AuditService) GetAuditHistory(auditType string, targetID uint64) ([]AuditHistory, error) {
	var history []AuditHistory

	err := s.db.Table("audit_logs al").
		Select(`
			al.id,
			al.audit_type,
			al.target_id,
			al.action,
			al.reason,
			al.auditor_id,
			u.username as auditor_name,
			al.created_at
		`).
		Joins("LEFT JOIN users u ON u.id = al.auditor_id").
		Where("al.audit_type = ? AND al.target_id = ?", auditType, targetID).
		Order("al.created_at DESC").
		Scan(&history).Error

	return history, err
}

// GetPendingAuditCounts 获取待审核数量统计
func (s *AuditService) GetPendingAuditCounts() (map[string]int64, error) {
	counts := make(map[string]int64)

	// 待审核配送设置数量
	var deliveryCount int64
	s.db.Table("delivery_settings").Where("audit_status = ?", "pending").Count(&deliveryCount)
	counts["delivery"] = deliveryCount

	// 待审核产品数量
	var productCount int64
	s.db.Table("supplier_materials").Where("status = ?", "pending").Count(&productCount)
	counts["product"] = productCount

	// 待审核配送区域数量
	var areaCount int64
	s.db.Table("delivery_areas").Where("audit_status = ?", "pending").Count(&areaCount)
	counts["deliveryArea"] = areaCount

	return counts, nil
}

// CheckPriceAnomaly 检查价格异常
func (s *AuditService) CheckPriceAnomaly(materialSkuID uint64, newPrice float64) (bool, string) {
	// 获取历史价格
	var avgPrice float64
	s.db.Table("supplier_materials").
		Select("AVG(price)").
		Where("material_sku_id = ? AND status = ?", materialSkuID, "approved").
		Scan(&avgPrice)

	if avgPrice == 0 {
		return false, ""
	}

	// 计算价格变动率
	changeRate := (newPrice - avgPrice) / avgPrice * 100

	if changeRate > 20 || changeRate < -20 {
		return true, "价格变动超过20%，请核实"
	}

	return false, ""
}

// CheckDuplicateProduct 检查重复产品
func (s *AuditService) CheckDuplicateProduct(supplierID uint64, materialSkuID uint64) (bool, error) {
	var count int64
	err := s.db.Table("supplier_materials").
		Where("supplier_id = ? AND material_sku_id = ? AND status IN ?", supplierID, materialSkuID, []string{"approved", "pending"}).
		Count(&count).Error

	return count > 0, err
}

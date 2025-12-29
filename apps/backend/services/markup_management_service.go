package services

import (
	"time"

	"gorm.io/gorm"
)

// MarkupManagementService 加价管理服务
type MarkupManagementService struct {
	db *gorm.DB
}

// NewMarkupManagementService 创建加价管理服务
func NewMarkupManagementService(db *gorm.DB) *MarkupManagementService {
	return &MarkupManagementService{db: db}
}

// MarkupSwitch 加价开关
type MarkupSwitch struct {
	ID           uint64  `json:"id"`
	Name         string  `json:"name"`
	SwitchType   string  `json:"switchType"` // global, supplier, store, category
	IsEnabled    bool    `json:"isEnabled"`
	MarkupIncome float64 `json:"markupIncome"`
}

// MarkupOverview 加价收入概览
type MarkupOverview struct {
	TodayIncome    float64 `json:"todayIncome"`
	MonthIncome    float64 `json:"monthIncome"`
	TotalIncome    float64 `json:"totalIncome"`
	AvgMarkupRate  float64 `json:"avgMarkupRate"`
	ActiveRules    int64   `json:"activeRules"`
	GlobalEnabled  bool    `json:"globalEnabled"`
}

// MarkupRule 加价规则
type MarkupRule struct {
	ID          uint64     `json:"id"`
	Name        string     `json:"name"`
	StoreID     *uint64    `json:"storeId"`
	StoreName   string     `json:"storeName"`
	SupplierID  *uint64    `json:"supplierId"`
	SupplierName string    `json:"supplierName"`
	CategoryID  *uint64    `json:"categoryId"`
	CategoryName string    `json:"categoryName"`
	MaterialID  *uint64    `json:"materialId"`
	MaterialName string    `json:"materialName"`
	MarkupType  string     `json:"markupType"` // fixed, percent
	MarkupValue float64    `json:"markupValue"`
	Priority    int        `json:"priority"`
	IsActive    bool       `json:"isActive"`
	CreatedAt   time.Time  `json:"createdAt"`
}

// GetMarkupOverview 获取加价收入概览
func (s *MarkupManagementService) GetMarkupOverview() (*MarkupOverview, error) {
	overview := &MarkupOverview{}
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// 今日加价收入
	s.db.Table("orders").
		Select("COALESCE(SUM(markup_amount), 0)").
		Where("created_at >= ?", todayStart).
		Scan(&overview.TodayIncome)

	// 本月加价收入
	s.db.Table("orders").
		Select("COALESCE(SUM(markup_amount), 0)").
		Where("created_at >= ?", monthStart).
		Scan(&overview.MonthIncome)

	// 累计加价收入
	s.db.Table("orders").
		Select("COALESCE(SUM(markup_amount), 0)").
		Scan(&overview.TotalIncome)

	// 平均加价率
	s.db.Table("price_markups").
		Where("is_active = ?", true).
		Select("COALESCE(AVG(markup_value), 0)").
		Scan(&overview.AvgMarkupRate)

	// 激活的规则数
	s.db.Table("price_markups").
		Where("is_active = ?", true).
		Count(&overview.ActiveRules)

	// 全局开关状态
	var globalSwitch string
	s.db.Table("system_configs").
		Select("config_value").
		Where("config_key = ?", "markup_global_enabled").
		Scan(&globalSwitch)
	overview.GlobalEnabled = globalSwitch == "true" || globalSwitch == "1"

	return overview, nil
}

// SetGlobalSwitch 设置全局加价开关
func (s *MarkupManagementService) SetGlobalSwitch(enabled bool) error {
	value := "false"
	if enabled {
		value = "true"
	}
	return s.db.Table("system_configs").
		Where("config_key = ?", "markup_global_enabled").
		Update("config_value", value).Error
}

// GetSupplierSwitches 获取供应商加价开关列表
func (s *MarkupManagementService) GetSupplierSwitches(page, pageSize int) ([]MarkupSwitch, int64, error) {
	var switches []MarkupSwitch
	var total int64

	query := s.db.Table("suppliers s").
		Select(`
			s.id,
			s.name,
			'supplier' as switch_type,
			s.markup_enabled as is_enabled,
			COALESCE((SELECT SUM(markup_amount) FROM orders WHERE supplier_id = s.id), 0) as markup_income
		`)

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&switches).Error
	return switches, total, err
}

// SetSupplierSwitch 设置供应商加价开关
func (s *MarkupManagementService) SetSupplierSwitch(supplierID uint64, enabled bool) error {
	return s.db.Table("suppliers").
		Where("id = ?", supplierID).
		Update("markup_enabled", enabled).Error
}

// BatchSetSupplierSwitch 批量设置供应商加价开关
func (s *MarkupManagementService) BatchSetSupplierSwitch(supplierIDs []uint64, enabled bool) error {
	return s.db.Table("suppliers").
		Where("id IN ?", supplierIDs).
		Update("markup_enabled", enabled).Error
}

// GetStoreSwitches 获取门店加价开关列表
func (s *MarkupManagementService) GetStoreSwitches(page, pageSize int) ([]MarkupSwitch, int64, error) {
	var switches []MarkupSwitch
	var total int64

	query := s.db.Table("stores st").
		Select(`
			st.id,
			st.name,
			'store' as switch_type,
			st.markup_enabled as is_enabled,
			COALESCE((SELECT SUM(markup_amount) FROM orders WHERE store_id = st.id), 0) as markup_income
		`)

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&switches).Error
	return switches, total, err
}

// SetStoreSwitch 设置门店加价开关
func (s *MarkupManagementService) SetStoreSwitch(storeID uint64, enabled bool) error {
	return s.db.Table("stores").
		Where("id = ?", storeID).
		Update("markup_enabled", enabled).Error
}

// BatchSetStoreSwitch 批量设置门店加价开关
func (s *MarkupManagementService) BatchSetStoreSwitch(storeIDs []uint64, enabled bool) error {
	return s.db.Table("stores").
		Where("id IN ?", storeIDs).
		Update("markup_enabled", enabled).Error
}

// GetCategorySwitches 获取分类加价开关列表
func (s *MarkupManagementService) GetCategorySwitches(page, pageSize int) ([]MarkupSwitch, int64, error) {
	var switches []MarkupSwitch
	var total int64

	query := s.db.Table("categories c").
		Select(`
			c.id,
			c.name,
			'category' as switch_type,
			c.markup_enabled as is_enabled,
			0 as markup_income
		`).
		Where("c.parent_id IS NULL OR c.parent_id = 0")

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&switches).Error
	return switches, total, err
}

// SetCategorySwitch 设置分类加价开关
func (s *MarkupManagementService) SetCategorySwitch(categoryID uint64, enabled bool) error {
	return s.db.Table("categories").
		Where("id = ?", categoryID).
		Update("markup_enabled", enabled).Error
}

// GetMarkupRules 获取加价规则列表
func (s *MarkupManagementService) GetMarkupRules(page, pageSize int, keyword string, isActive *bool) ([]MarkupRule, int64, error) {
	var rules []MarkupRule
	var total int64

	query := s.db.Table("price_markups pm").
		Select(`
			pm.id,
			pm.name,
			pm.store_id,
			st.name as store_name,
			pm.supplier_id,
			sp.name as supplier_name,
			pm.category_id,
			c.name as category_name,
			pm.material_id,
			ms.name as material_name,
			pm.markup_type,
			pm.markup_value,
			pm.priority,
			pm.is_active,
			pm.created_at
		`).
		Joins("LEFT JOIN stores st ON st.id = pm.store_id").
		Joins("LEFT JOIN suppliers sp ON sp.id = pm.supplier_id").
		Joins("LEFT JOIN categories c ON c.id = pm.category_id").
		Joins("LEFT JOIN material_skus ms ON ms.id = pm.material_id")

	if keyword != "" {
		query = query.Where("pm.name LIKE ?", "%"+keyword+"%")
	}
	if isActive != nil {
		query = query.Where("pm.is_active = ?", *isActive)
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("pm.priority DESC, pm.created_at DESC").Offset(offset).Limit(pageSize).Scan(&rules).Error
	return rules, total, err
}

// CreateMarkupRule 创建加价规则
func (s *MarkupManagementService) CreateMarkupRule(name string, storeID, supplierID, categoryID, materialID *uint64, markupType string, markupValue float64, isActive bool) error {
	// 计算优先级
	priority := s.calculatePriority(storeID, supplierID, categoryID, materialID)

	return s.db.Table("price_markups").Create(map[string]interface{}{
		"name":         name,
		"store_id":     storeID,
		"supplier_id":  supplierID,
		"category_id":  categoryID,
		"material_id":  materialID,
		"markup_type":  markupType,
		"markup_value": markupValue,
		"priority":     priority,
		"is_active":    isActive,
		"created_at":   time.Now(),
		"updated_at":   time.Now(),
	}).Error
}

// calculatePriority 计算规则优先级
func (s *MarkupManagementService) calculatePriority(storeID, supplierID, categoryID, materialID *uint64) int {
	priority := 0
	if materialID != nil {
		priority += 1000 // 物料级最高优先级
	}
	if categoryID != nil {
		priority += 100
	}
	if supplierID != nil {
		priority += 10
	}
	if storeID != nil {
		priority += 1
	}
	return priority
}

// UpdateMarkupRule 更新加价规则
func (s *MarkupManagementService) UpdateMarkupRule(id uint64, name string, markupType string, markupValue float64, isActive bool) error {
	return s.db.Table("price_markups").
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"name":         name,
			"markup_type":  markupType,
			"markup_value": markupValue,
			"is_active":    isActive,
			"updated_at":   time.Now(),
		}).Error
}

// DeleteMarkupRule 删除加价规则
func (s *MarkupManagementService) DeleteMarkupRule(id uint64) error {
	return s.db.Table("price_markups").Where("id = ?", id).Delete(nil).Error
}

// ToggleMarkupRule 切换加价规则状态
func (s *MarkupManagementService) ToggleMarkupRule(id uint64, isActive bool) error {
	return s.db.Table("price_markups").
		Where("id = ?", id).
		Update("is_active", isActive).Error
}

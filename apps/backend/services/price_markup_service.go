package services

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// PriceMarkupService 加价规则服务
type PriceMarkupService struct {
	db *gorm.DB
}

// NewPriceMarkupService 创建加价规则服务
func NewPriceMarkupService(db *gorm.DB) *PriceMarkupService {
	return &PriceMarkupService{db: db}
}

// MarkupType 加价方式
type MarkupType string

const (
	MarkupTypeFixed   MarkupType = "fixed"
	MarkupTypePercent MarkupType = "percent"
)

// PriceMarkup 加价规则模型
type PriceMarkup struct {
	ID          uint64     `gorm:"primaryKey" json:"id"`
	Name        string     `gorm:"type:varchar(100);not null" json:"name"`
	Description string     `gorm:"type:varchar(500)" json:"description"`
	StoreID     *uint64    `gorm:"index" json:"storeId"`
	SupplierID  *uint64    `gorm:"index" json:"supplierId"`
	CategoryID  *uint64    `json:"categoryId"`
	MaterialID  *uint64    `json:"materialId"`
	MarkupType  MarkupType `gorm:"type:varchar(20);not null" json:"markupType"`
	MarkupValue float64    `gorm:"type:decimal(10,4);not null" json:"markupValue"`
	MinMarkup   float64    `gorm:"type:decimal(10,2)" json:"minMarkup"`
	MaxMarkup   float64    `gorm:"type:decimal(10,2)" json:"maxMarkup"`
	Priority    int        `gorm:"default:0" json:"priority"`
	IsActive    bool       `gorm:"default:true" json:"isActive"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
	CreatedBy   uint64     `json:"createdBy"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// TableName 表名
func (PriceMarkup) TableName() string {
	return "price_markups"
}

// CreatePriceMarkupRequest 创建加价规则请求
type CreatePriceMarkupRequest struct {
	Name        string     `json:"name" validate:"required,max=100"`
	Description string     `json:"description" validate:"max=500"`
	StoreID     *uint64    `json:"storeId"`
	SupplierID  *uint64    `json:"supplierId"`
	CategoryID  *uint64    `json:"categoryId"`
	MaterialID  *uint64    `json:"materialId"`
	MarkupType  MarkupType `json:"markupType" validate:"required,oneof=fixed percent"`
	MarkupValue float64    `json:"markupValue" validate:"required,gt=0"`
	MinMarkup   float64    `json:"minMarkup" validate:"gte=0"`
	MaxMarkup   float64    `json:"maxMarkup" validate:"gte=0"`
	Priority    int        `json:"priority"`
	IsActive    bool       `json:"isActive"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
}

// UpdatePriceMarkupRequest 更新加价规则请求
type UpdatePriceMarkupRequest struct {
	Name        string     `json:"name" validate:"max=100"`
	Description string     `json:"description" validate:"max=500"`
	StoreID     *uint64    `json:"storeId"`
	SupplierID  *uint64    `json:"supplierId"`
	CategoryID  *uint64    `json:"categoryId"`
	MaterialID  *uint64    `json:"materialId"`
	MarkupType  MarkupType `json:"markupType" validate:"oneof=fixed percent"`
	MarkupValue float64    `json:"markupValue" validate:"gt=0"`
	MinMarkup   float64    `json:"minMarkup" validate:"gte=0"`
	MaxMarkup   float64    `json:"maxMarkup" validate:"gte=0"`
	Priority    int        `json:"priority"`
	IsActive    *bool      `json:"isActive"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
}

// PriceMarkupQueryParams 加价规则查询参数
type PriceMarkupQueryParams struct {
	Page       int     `query:"page"`
	PageSize   int     `query:"pageSize"`
	Name       string  `query:"name"`
	StoreID    *uint64 `query:"storeId"`
	SupplierID *uint64 `query:"supplierId"`
	CategoryID *uint64 `query:"categoryId"`
	MaterialID *uint64 `query:"materialId"`
	IsActive   *bool   `query:"isActive"`
}

// CalculateMarkupRequest 计算加价请求
type CalculateMarkupRequest struct {
	StoreID       uint64  `json:"storeId" validate:"required"`
	SupplierID    uint64  `json:"supplierId" validate:"required"`
	CategoryID    uint64  `json:"categoryId"`
	MaterialID    uint64  `json:"materialId"`
	OriginalPrice float64 `json:"originalPrice" validate:"required,gt=0"`
}

// CalculateMarkupResponse 计算加价响应
type CalculateMarkupResponse struct {
	OriginalPrice float64      `json:"originalPrice"`
	MarkupAmount  float64      `json:"markupAmount"`
	FinalPrice    float64      `json:"finalPrice"`
	AppliedRule   *PriceMarkup `json:"appliedRule,omitempty"`
}

// Create 创建加价规则
func (s *PriceMarkupService) Create(req *CreatePriceMarkupRequest, createdBy uint64) (*PriceMarkup, error) {
	markup := &PriceMarkup{
		Name:        req.Name,
		Description: req.Description,
		StoreID:     req.StoreID,
		SupplierID:  req.SupplierID,
		CategoryID:  req.CategoryID,
		MaterialID:  req.MaterialID,
		MarkupType:  req.MarkupType,
		MarkupValue: req.MarkupValue,
		MinMarkup:   req.MinMarkup,
		MaxMarkup:   req.MaxMarkup,
		Priority:    req.Priority,
		IsActive:    req.IsActive,
		StartTime:   req.StartTime,
		EndTime:     req.EndTime,
		CreatedBy:   createdBy,
	}

	if err := s.db.Create(markup).Error; err != nil {
		return nil, err
	}
	return markup, nil
}

// Update 更新加价规则
func (s *PriceMarkupService) Update(id uint64, req *UpdatePriceMarkupRequest) (*PriceMarkup, error) {
	var markup PriceMarkup
	if err := s.db.First(&markup, id).Error; err != nil {
		return nil, err
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.StoreID != nil {
		updates["store_id"] = req.StoreID
	}
	if req.SupplierID != nil {
		updates["supplier_id"] = req.SupplierID
	}
	if req.CategoryID != nil {
		updates["category_id"] = req.CategoryID
	}
	if req.MaterialID != nil {
		updates["material_id"] = req.MaterialID
	}
	if req.MarkupType != "" {
		updates["markup_type"] = req.MarkupType
	}
	if req.MarkupValue > 0 {
		updates["markup_value"] = req.MarkupValue
	}
	if req.MinMarkup >= 0 {
		updates["min_markup"] = req.MinMarkup
	}
	if req.MaxMarkup >= 0 {
		updates["max_markup"] = req.MaxMarkup
	}
	updates["priority"] = req.Priority
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}
	if req.StartTime != nil {
		updates["start_time"] = req.StartTime
	}
	if req.EndTime != nil {
		updates["end_time"] = req.EndTime
	}

	if err := s.db.Model(&markup).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &markup, nil
}

// Delete 删除加价规则
func (s *PriceMarkupService) Delete(id uint64) error {
	result := s.db.Delete(&PriceMarkup{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("规则不存在")
	}
	return nil
}

// GetByID 根据ID获取加价规则
func (s *PriceMarkupService) GetByID(id uint64) (*PriceMarkup, error) {
	var markup PriceMarkup
	if err := s.db.First(&markup, id).Error; err != nil {
		return nil, err
	}
	return &markup, nil
}

// List 获取加价规则列表
func (s *PriceMarkupService) List(params *PriceMarkupQueryParams) ([]PriceMarkup, int64, error) {
	var markups []PriceMarkup
	var total int64

	query := s.db.Model(&PriceMarkup{})

	if params.Name != "" {
		query = query.Where("name LIKE ?", "%"+params.Name+"%")
	}
	if params.StoreID != nil {
		query = query.Where("store_id = ? OR store_id IS NULL", *params.StoreID)
	}
	if params.SupplierID != nil {
		query = query.Where("supplier_id = ? OR supplier_id IS NULL", *params.SupplierID)
	}
	if params.CategoryID != nil {
		query = query.Where("category_id = ? OR category_id IS NULL", *params.CategoryID)
	}
	if params.MaterialID != nil {
		query = query.Where("material_id = ? OR material_id IS NULL", *params.MaterialID)
	}
	if params.IsActive != nil {
		query = query.Where("is_active = ?", *params.IsActive)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	if err := query.Order("priority DESC, created_at DESC").Offset(offset).Limit(pageSize).Find(&markups).Error; err != nil {
		return nil, 0, err
	}

	return markups, total, nil
}

// GetActiveRules 获取生效中的规则列表
func (s *PriceMarkupService) GetActiveRules() ([]PriceMarkup, error) {
	var markups []PriceMarkup
	now := time.Now()

	err := s.db.Where("is_active = ?", true).
		Where("(start_time IS NULL OR start_time <= ?)", now).
		Where("(end_time IS NULL OR end_time >= ?)", now).
		Order("priority DESC").
		Find(&markups).Error

	return markups, err
}

// UpdateStatus 更新规则状态
func (s *PriceMarkupService) UpdateStatus(id uint64, isActive bool) error {
	return s.db.Model(&PriceMarkup{}).Where("id = ?", id).Update("is_active", isActive).Error
}

// CalculateMarkup 计算加价
func (s *PriceMarkupService) CalculateMarkup(req *CalculateMarkupRequest) (*CalculateMarkupResponse, error) {
	// 获取所有生效中的规则
	rules, err := s.GetActiveRules()
	if err != nil {
		return nil, err
	}

	// 按优先级从高到低匹配规则
	var matchedRule *PriceMarkup
	for i := range rules {
		rule := &rules[i]
		if s.matchRule(rule, req) {
			matchedRule = rule
			break
		}
	}

	response := &CalculateMarkupResponse{
		OriginalPrice: req.OriginalPrice,
		MarkupAmount:  0,
		FinalPrice:    req.OriginalPrice,
	}

	if matchedRule != nil {
		markupAmount := s.calculateMarkupAmount(matchedRule, req.OriginalPrice)
		response.MarkupAmount = markupAmount
		response.FinalPrice = req.OriginalPrice + markupAmount
		response.AppliedRule = matchedRule
	}

	return response, nil
}

// matchRule 检查规则是否匹配
func (s *PriceMarkupService) matchRule(rule *PriceMarkup, req *CalculateMarkupRequest) bool {
	// 检查门店匹配
	if rule.StoreID != nil && *rule.StoreID != req.StoreID {
		return false
	}
	// 检查供应商匹配
	if rule.SupplierID != nil && *rule.SupplierID != req.SupplierID {
		return false
	}
	// 检查分类匹配
	if rule.CategoryID != nil && *rule.CategoryID != req.CategoryID {
		return false
	}
	// 检查物料匹配
	if rule.MaterialID != nil && *rule.MaterialID != req.MaterialID {
		return false
	}
	return true
}

// calculateMarkupAmount 计算加价金额
func (s *PriceMarkupService) calculateMarkupAmount(rule *PriceMarkup, originalPrice float64) float64 {
	var markup float64

	if rule.MarkupType == MarkupTypeFixed {
		markup = rule.MarkupValue
	} else {
		markup = originalPrice * rule.MarkupValue
	}

	// 应用最小/最大限制
	if rule.MinMarkup > 0 && markup < rule.MinMarkup {
		markup = rule.MinMarkup
	}
	if rule.MaxMarkup > 0 && markup > rule.MaxMarkup {
		markup = rule.MaxMarkup
	}

	return markup
}

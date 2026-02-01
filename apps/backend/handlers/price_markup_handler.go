package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// PriceMarkupHandler 加价规则处理器
type PriceMarkupHandler struct {
	db *gorm.DB
}

// NewPriceMarkupHandler 创建加价规则处理器
func NewPriceMarkupHandler(db *gorm.DB) *PriceMarkupHandler {
	return &PriceMarkupHandler{db: db}
}

// MarkupType 加价方式
type MarkupType string

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
}

// UpdatePriceMarkupRequest 更新加价规则请求
type UpdatePriceMarkupRequest struct {
	Name        string     `json:"name" validate:"max=100"`
	Description string     `json:"description" validate:"max=500"`
	MarkupType  MarkupType `json:"markupType" validate:"oneof=fixed percent"`
	MarkupValue float64    `json:"markupValue"`
	MinMarkup   float64    `json:"minMarkup"`
	MaxMarkup   float64    `json:"maxMarkup"`
	Priority    int        `json:"priority"`
	IsActive    *bool      `json:"isActive"`
}

// CalculateMarkupRequest 计算加价请求
type CalculateMarkupRequest struct {
	StoreID       uint64  `json:"storeId" validate:"required"`
	SupplierID    uint64  `json:"supplierId" validate:"required"`
	CategoryID    uint64  `json:"categoryId"`
	MaterialID    uint64  `json:"materialId"`
	OriginalPrice float64 `json:"originalPrice" validate:"required,gt=0"`
}

// Create 创建加价规则
// @Summary 创建加价规则
// @Tags 加价规则管理
// @Accept json
// @Produce json
// @Param request body CreatePriceMarkupRequest true "创建请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups [post]
func (h *PriceMarkupHandler) Create(c echo.Context) error {
	var req CreatePriceMarkupRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数验证失败: " + err.Error(),
		})
	}

	userID := GetUserID(c)
	markup := &models.PriceMarkup{
		Name:        req.Name,
		Description: req.Description,
		StoreID:     req.StoreID,
		SupplierID:  req.SupplierID,
		CategoryID:  req.CategoryID,
		MaterialID:  req.MaterialID,
		MarkupType:  models.MarkupType(req.MarkupType),
		MarkupValue: req.MarkupValue,
		MinMarkup:   req.MinMarkup,
		MaxMarkup:   req.MaxMarkup,
		Priority:    req.Priority,
		IsActive:    req.IsActive,
		CreatedBy:   userID,
	}

	if err := h.db.Create(markup).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "创建失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "创建成功",
		"data":    markup,
	})
}

// Update 更新加价规则
// @Summary 更新加价规则
// @Tags 加价规则管理
// @Accept json
// @Produce json
// @Param id path int true "规则ID"
// @Param request body UpdatePriceMarkupRequest true "更新请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/{id} [put]
func (h *PriceMarkupHandler) Update(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var req UpdatePriceMarkupRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	var markup models.PriceMarkup
	if err := h.db.First(&markup, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "规则不存在",
		})
	}

	updates := make(map[string]interface{})
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.MarkupType != "" {
		updates["markup_type"] = req.MarkupType
	}
	if req.MarkupValue > 0 {
		updates["markup_value"] = req.MarkupValue
	}
	updates["min_markup"] = req.MinMarkup
	updates["max_markup"] = req.MaxMarkup
	updates["priority"] = req.Priority
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if err := h.db.Model(&markup).Updates(updates).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "更新失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "更新成功",
		"data":    markup,
	})
}

// Delete 删除加价规则
// @Summary 删除加价规则
// @Tags 加价规则管理
// @Param id path int true "规则ID"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/{id} [delete]
func (h *PriceMarkupHandler) Delete(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	if err := h.db.Delete(&models.PriceMarkup{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "删除失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "删除成功",
	})
}

// GetByID 获取加价规则详情
// @Summary 获取加价规则详情
// @Tags 加价规则管理
// @Param id path int true "规则ID"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/{id} [get]
func (h *PriceMarkupHandler) GetByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var markup models.PriceMarkup
	if err := h.db.Preload("Store").Preload("Supplier").Preload("Category").First(&markup, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "规则不存在",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    markup,
	})
}

// List 获取加价规则列表
// @Summary 获取加价规则列表
// @Tags 加价规则管理
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Param name query string false "规则名称"
// @Param storeId query int false "门店ID"
// @Param supplierId query int false "供应商ID"
// @Param isActive query bool false "是否启用"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups [get]
func (h *PriceMarkupHandler) List(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	var total int64
	var markups []models.PriceMarkup

	query := h.db.Model(&models.PriceMarkup{})

	// 筛选条件
	if name := c.QueryParam("name"); name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}
	if storeID := c.QueryParam("storeId"); storeID != "" {
		query = query.Where("store_id = ?", storeID)
	}
	if supplierID := c.QueryParam("supplierId"); supplierID != "" {
		query = query.Where("supplier_id = ?", supplierID)
	}
	if isActive := c.QueryParam("isActive"); isActive != "" {
		query = query.Where("is_active = ?", isActive == "true")
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Preload("Store").Preload("Supplier").Preload("Category").
		Order("priority DESC, created_at DESC").
		Offset(offset).Limit(pageSize).Find(&markups).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items":    markups,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

// GetActiveRules 获取生效中的规则列表
// @Summary 获取生效中的规则列表
// @Tags 加价规则管理
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/active [get]
func (h *PriceMarkupHandler) GetActiveRules(c echo.Context) error {
	var markups []models.PriceMarkup
	if err := h.db.Where("is_active = ?", true).
		Preload("Store").Preload("Supplier").Preload("Category").
		Order("priority DESC").Find(&markups).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    markups,
	})
}

// UpdateStatus 更新规则状态
// @Summary 更新规则状态
// @Tags 加价规则管理
// @Param id path int true "规则ID"
// @Param isActive query bool true "是否启用"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/{id}/status [put]
func (h *PriceMarkupHandler) UpdateStatus(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	isActive := c.QueryParam("isActive") == "true"

	if err := h.db.Model(&models.PriceMarkup{}).Where("id = ?", id).Update("is_active", isActive).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "更新失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "更新成功",
	})
}

// CalculateMarkup 计算加价（管理员端）
// @Summary 计算加价
// @Tags 加价规则管理
// @Accept json
// @Produce json
// @Param request body CalculateMarkupRequest true "计算请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/calculate [post]
func (h *PriceMarkupHandler) CalculateMarkup(c echo.Context) error {
	var req CalculateMarkupRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 查找适用的加价规则（按优先级排序）
	var markup models.PriceMarkup
	query := h.db.Where("is_active = ?", true)

	// 匹配条件：物料 > 分类 > 供应商 > 门店 > 全局
	if req.MaterialID > 0 {
		query = query.Where("material_id = ? OR material_id IS NULL", req.MaterialID)
	}
	if req.CategoryID > 0 {
		query = query.Where("category_id = ? OR category_id IS NULL", req.CategoryID)
	}
	if req.SupplierID > 0 {
		query = query.Where("supplier_id = ? OR supplier_id IS NULL", req.SupplierID)
	}
	if req.StoreID > 0 {
		query = query.Where("store_id = ? OR store_id IS NULL", req.StoreID)
	}

	var markupAmount float64
	var appliedRule interface{}

	if err := query.Order("priority DESC").First(&markup).Error; err == nil {
		markupAmount = markup.CalculateMarkup(req.OriginalPrice)
		appliedRule = markup
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "计算成功",
		"data": map[string]interface{}{
			"originalPrice": req.OriginalPrice,
			"markupAmount":  markupAmount,
			"finalPrice":    req.OriginalPrice + markupAmount,
			"appliedRule":   appliedRule,
		},
	})
}

// StoreCalculateMarkup 门店端计算加价
// @Summary 门店端计算加价
// @Tags 门店-加价
// @Accept json
// @Produce json
// @Param request body CalculateMarkupRequest true "计算请求"
// @Success 200 {object} map[string]interface{}
// @Router /store/price-markups/calculate [post]
func (h *PriceMarkupHandler) StoreCalculateMarkup(c echo.Context) error {
	var req CalculateMarkupRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 从上下文获取门店ID
	storeID := GetStoreID(c)
	if storeID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}
	req.StoreID = storeID

	// 查找适用的加价规则
	var markup models.PriceMarkup
	query := h.db.Where("is_active = ?", true)

	if req.MaterialID > 0 {
		query = query.Where("material_id = ? OR material_id IS NULL", req.MaterialID)
	}
	if req.CategoryID > 0 {
		query = query.Where("category_id = ? OR category_id IS NULL", req.CategoryID)
	}
	if req.SupplierID > 0 {
		query = query.Where("supplier_id = ? OR supplier_id IS NULL", req.SupplierID)
	}
	query = query.Where("store_id = ? OR store_id IS NULL", req.StoreID)

	var markupAmount float64
	if err := query.Order("priority DESC").First(&markup).Error; err == nil {
		markupAmount = markup.CalculateMarkup(req.OriginalPrice)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "计算成功",
		"data": map[string]interface{}{
			"originalPrice": req.OriginalPrice,
			"markupAmount":  markupAmount,
			"finalPrice":    req.OriginalPrice + markupAmount,
		},
	})
}

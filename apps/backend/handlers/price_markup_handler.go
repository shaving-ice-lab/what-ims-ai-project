package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// PriceMarkupHandler 加价规则处理器
type PriceMarkupHandler struct {
	// service *services.PriceMarkupService
}

// NewPriceMarkupHandler 创建加价规则处理器
func NewPriceMarkupHandler() *PriceMarkupHandler {
	return &PriceMarkupHandler{}
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

	// TODO: 调用service创建规则
	// markup, err := h.service.Create(&req, userID)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "创建成功",
		"data":    nil,
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

	// TODO: 调用service更新规则
	_ = id

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "更新成功",
		"data":    nil,
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

	// TODO: 调用service删除规则
	_ = id

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

	// TODO: 调用service获取规则详情
	_ = id

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    nil,
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
	// TODO: 调用service获取列表

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items": []interface{}{},
			"total": 0,
		},
	})
}

// GetActiveRules 获取生效中的规则列表
// @Summary 获取生效中的规则列表
// @Tags 加价规则管理
// @Success 200 {object} map[string]interface{}
// @Router /admin/price-markups/active [get]
func (h *PriceMarkupHandler) GetActiveRules(c echo.Context) error {
	// TODO: 调用service获取生效规则

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    []interface{}{},
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

	// TODO: 调用service更新状态
	_ = id
	_ = isActive

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

	// TODO: 调用service计算加价

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "计算成功",
		"data": map[string]interface{}{
			"originalPrice": req.OriginalPrice,
			"markupAmount":  0,
			"finalPrice":    req.OriginalPrice,
			"appliedRule":   nil,
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

	// TODO: 从上下文获取门店ID并覆盖请求中的storeId
	// req.StoreID = getStoreIDFromContext(c)

	// TODO: 调用service计算加价

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "计算成功",
		"data": map[string]interface{}{
			"originalPrice": req.OriginalPrice,
			"markupAmount":  0,
			"finalPrice":    req.OriginalPrice,
		},
	})
}

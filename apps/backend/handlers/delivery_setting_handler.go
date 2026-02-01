package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// DeliverySettingHandler 配送设置处理器
type DeliverySettingHandler struct {
	db *gorm.DB
}

// NewDeliverySettingHandler 创建配送设置处理器
func NewDeliverySettingHandler(db *gorm.DB) *DeliverySettingHandler {
	return &DeliverySettingHandler{db: db}
}

// UpdateDeliverySettingRequest 更新配送设置请求
type UpdateDeliverySettingReq struct {
	MinOrderAmount float64 `json:"minOrderAmount" validate:"required,gt=0"`
	DeliveryDays   string  `json:"deliveryDays" validate:"required"`
}

// GetDeliverySetting 获取配送设置
// @Summary 获取配送设置
// @Tags 供应商-配送设置
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-settings [get]
func (h *DeliverySettingHandler) GetDeliverySetting(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	var supplier models.Supplier
	if err := h.db.Select("min_order_amount, delivery_days, delivery_mode").First(&supplier, supplierID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "供应商不存在",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"minOrderAmount": supplier.MinOrderAmount,
			"deliveryDays":   supplier.DeliveryDays,
			"deliveryMode":   supplier.DeliveryMode,
		},
	})
}

// UpdateDeliverySetting 更新配送设置（提交审核）
// @Summary 更新配送设置
// @Tags 供应商-配送设置
// @Accept json
// @Produce json
// @Param request body UpdateDeliverySettingReq true "更新请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-settings [put]
func (h *DeliverySettingHandler) UpdateDeliverySetting(c echo.Context) error {
	var req UpdateDeliverySettingReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	updates := map[string]interface{}{
		"min_order_amount": req.MinOrderAmount,
		"delivery_days":    req.DeliveryDays,
	}

	if err := h.db.Model(&models.Supplier{}).Where("id = ?", supplierID).Updates(updates).Error; err != nil {
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

// GetDeliveryAreas 获取配送区域列表
// @Summary 获取配送区域列表
// @Tags 供应商-配送设置
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-areas [get]
func (h *DeliverySettingHandler) GetDeliveryAreas(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	var areas []models.DeliveryArea
	if err := h.db.Where("supplier_id = ?", supplierID).Find(&areas).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    areas,
	})
}

// AddDeliveryAreaRequest 添加配送区域请求
type AddDeliveryAreaReq struct {
	Province string `json:"province" validate:"required"`
	City     string `json:"city"`
	District string `json:"district"`
}

// AddDeliveryArea 添加配送区域
// @Summary 添加配送区域
// @Tags 供应商-配送设置
// @Accept json
// @Produce json
// @Param request body AddDeliveryAreaReq true "添加请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-areas [post]
func (h *DeliverySettingHandler) AddDeliveryArea(c echo.Context) error {
	var req AddDeliveryAreaReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	area := &models.DeliveryArea{
		SupplierID: supplierID,
		Province:   req.Province,
		City:       req.City,
		District:   &req.District,
	}

	if err := h.db.Create(area).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "添加失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "添加成功",
		"data":    area,
	})
}

// BatchAddDeliveryAreasRequest 批量添加配送区域请求
type BatchAddDeliveryAreasReq struct {
	Areas []AddDeliveryAreaReq `json:"areas" validate:"required,min=1"`
}

// BatchAddDeliveryAreas 批量添加配送区域
// @Summary 批量添加配送区域
// @Tags 供应商-配送设置
// @Accept json
// @Produce json
// @Param request body BatchAddDeliveryAreasReq true "批量添加请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-areas/batch [post]
func (h *DeliverySettingHandler) BatchAddDeliveryAreas(c echo.Context) error {
	var req BatchAddDeliveryAreasReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	var areas []models.DeliveryArea
	for _, a := range req.Areas {
		areas = append(areas, models.DeliveryArea{
			SupplierID: supplierID,
			Province:   a.Province,
			City:       a.City,
			District:   &a.District,
		})
	}

	if err := h.db.Create(&areas).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "批量添加失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "批量添加成功",
		"data":    areas,
	})
}

// DeleteDeliveryArea 删除配送区域
// @Summary 删除配送区域
// @Tags 供应商-配送设置
// @Param id path int true "区域ID"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/delivery-areas/{id} [delete]
func (h *DeliverySettingHandler) DeleteDeliveryArea(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	if err := h.db.Where("id = ? AND supplier_id = ?", id, supplierID).Delete(&models.DeliveryArea{}).Error; err != nil {
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

// GetWaybills 获取运单列表
// @Summary 获取运单列表
// @Tags 供应商-配送设置
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/waybills [get]
func (h *DeliverySettingHandler) GetWaybills(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	// 获取该供应商的订单运单信息
	var orders []models.Order
	var total int64

	query := h.db.Model(&models.Order{}).Where("supplier_id = ? AND status IN (?)", supplierID, []string{"delivering", "completed"})
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Select("id, order_no, status, delivery_address, created_at").
		Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&orders).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items":    orders,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

// CreateWaybillRequest 创建运单请求
type CreateWaybillReq struct {
	OrderID   uint64 `json:"orderId" validate:"required"`
	WaybillNo string `json:"waybillNo" validate:"required"`
	Carrier   string `json:"carrier"`
}

// CreateWaybill 创建运单
// @Summary 创建运单
// @Tags 供应商-配送设置
// @Accept json
// @Produce json
// @Param request body CreateWaybillReq true "创建请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/waybills [post]
func (h *DeliverySettingHandler) CreateWaybill(c echo.Context) error {
	var req CreateWaybillReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	// 更新订单运单信息
	updates := map[string]interface{}{
		"waybill_no": req.WaybillNo,
	}
	if req.Carrier != "" {
		updates["carrier"] = req.Carrier
	}

	if err := h.db.Model(&models.Order{}).Where("id = ? AND supplier_id = ?", req.OrderID, supplierID).
		Updates(updates).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "创建失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "创建成功",
	})
}

// GetSupplierInfo 获取供应商信息
// @Summary 获取供应商信息
// @Tags 供应商-账户信息
// @Success 200 {object} map[string]interface{}
// @Router /supplier/info [get]
func (h *DeliverySettingHandler) GetSupplierInfo(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	var supplier models.Supplier
	if err := h.db.First(&supplier, supplierID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "供应商不存在",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    supplier,
	})
}

// ============ 管理员端配送设置审核 ============

// GetPendingAuditSettings 获取待审核的配送设置列表
// @Summary 获取待审核的配送设置列表
// @Tags 管理员-配送设置审核
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Success 200 {object} map[string]interface{}
// @Router /admin/delivery-settings/pending [get]
func (h *DeliverySettingHandler) GetPendingAuditSettings(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	// 获取所有供应商配送设置（简化版，实际应有审核状态字段）
	var suppliers []models.Supplier
	var total int64

	query := h.db.Model(&models.Supplier{}).Where("status = 1")
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Select("id, name, min_order_amount, delivery_days, delivery_mode").
		Offset(offset).Limit(pageSize).Find(&suppliers).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items":    suppliers,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

// AuditSettingRequest 审核配送设置请求
type AuditSettingReq struct {
	Approved     bool   `json:"approved"`
	RejectReason string `json:"rejectReason"`
}

// AuditDeliverySetting 审核配送设置
// @Summary 审核配送设置
// @Tags 管理员-配送设置审核
// @Accept json
// @Produce json
// @Param id path int true "设置ID"
// @Param request body AuditSettingReq true "审核请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/delivery-settings/{id}/audit [post]
func (h *DeliverySettingHandler) AuditDeliverySetting(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var req AuditSettingReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 更新供应商状态（简化版）
	status := int8(1) // 批准
	if !req.Approved {
		status = 0 // 拒绝
	}

	if err := h.db.Model(&models.Supplier{}).Where("id = ?", id).Update("status", status).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "审核失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "审核完成",
	})
}

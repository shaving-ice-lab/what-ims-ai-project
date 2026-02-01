package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// AdminDashboardHandler 管理员看板处理器
type AdminDashboardHandler struct {
	db *gorm.DB
}

// NewAdminDashboardHandler 创建管理员看板处理器
func NewAdminDashboardHandler(db *gorm.DB) *AdminDashboardHandler {
	return &AdminDashboardHandler{db: db}
}

// GetDashboardStats 获取看板统计数据
// @Summary 获取看板统计数据
// @Tags 管理员-数据看板
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/stats [get]
func (h *AdminDashboardHandler) GetDashboardStats(c echo.Context) error {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	var todayOrderCount, monthOrderCount int64
	var todayOrderAmount, monthMarkupIncome float64

	// 今日订单数
	h.db.Model(&models.Order{}).Where("created_at >= ?", todayStart).Count(&todayOrderCount)

	// 今日订单金额
	h.db.Model(&models.Order{}).Where("created_at >= ? AND status != ?", todayStart, models.OrderStatusCancelled).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&todayOrderAmount)

	// 本月订单数
	h.db.Model(&models.Order{}).Where("created_at >= ?", monthStart).Count(&monthOrderCount)

	// 本月加价收入
	h.db.Model(&models.Order{}).Where("created_at >= ? AND status != ?", monthStart, models.OrderStatusCancelled).
		Select("COALESCE(SUM(markup_amount), 0)").Scan(&monthMarkupIncome)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"todayOrderCount":   todayOrderCount,
			"todayOrderAmount":  todayOrderAmount,
			"monthOrderCount":   monthOrderCount,
			"monthMarkupIncome": monthMarkupIncome,
		},
	})
}

// GetOrderTrend 获取订单趋势
// @Summary 获取订单趋势
// @Tags 管理员-数据看板
// @Param days query int false "天数"
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/order-trend [get]
func (h *AdminDashboardHandler) GetOrderTrend(c echo.Context) error {
	days, _ := strconv.Atoi(c.QueryParam("days"))
	if days <= 0 || days > 30 {
		days = 7
	}

	now := time.Now()
	startDate := now.AddDate(0, 0, -days)

	type DailyTrend struct {
		Date        string  `json:"date"`
		OrderCount  int64   `json:"orderCount"`
		TotalAmount float64 `json:"totalAmount"`
	}

	var trends []DailyTrend
	h.db.Table("orders").
		Select("DATE(created_at) as date, COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_amount").
		Where("created_at >= ? AND status != ?", startDate, models.OrderStatusCancelled).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&trends)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    trends,
	})
}

// GetSupplierRanking 获取供应商排行
// @Summary 获取供应商排行
// @Tags 管理员-数据看板
// @Param limit query int false "数量限制"
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/supplier-ranking [get]
func (h *AdminDashboardHandler) GetSupplierRanking(c echo.Context) error {
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit <= 0 || limit > 20 {
		limit = 10
	}

	type SupplierRank struct {
		SupplierID   uint64  `json:"supplierId"`
		SupplierName string  `json:"supplierName"`
		OrderCount   int64   `json:"orderCount"`
		TotalAmount  float64 `json:"totalAmount"`
	}

	var rankings []SupplierRank
	h.db.Table("orders o").
		Select("o.supplier_id, s.name as supplier_name, COUNT(*) as order_count, COALESCE(SUM(o.total_amount), 0) as total_amount").
		Joins("JOIN suppliers s ON o.supplier_id = s.id").
		Where("o.status != ?", models.OrderStatusCancelled).
		Group("o.supplier_id, s.name").
		Order("total_amount DESC").
		Limit(limit).
		Scan(&rankings)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    rankings,
	})
}

// GetStoreRanking 获取门店排行
// @Summary 获取门店排行
// @Tags 管理员-数据看板
// @Param limit query int false "数量限制"
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/store-ranking [get]
func (h *AdminDashboardHandler) GetStoreRanking(c echo.Context) error {
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit <= 0 || limit > 20 {
		limit = 10
	}

	type StoreRank struct {
		StoreID     uint64  `json:"storeId"`
		StoreName   string  `json:"storeName"`
		OrderCount  int64   `json:"orderCount"`
		TotalAmount float64 `json:"totalAmount"`
	}

	var rankings []StoreRank
	h.db.Table("orders o").
		Select("o.store_id, s.name as store_name, COUNT(*) as order_count, COALESCE(SUM(o.total_amount), 0) as total_amount").
		Joins("JOIN stores s ON o.store_id = s.id").
		Where("o.status != ?", models.OrderStatusCancelled).
		Group("o.store_id, s.name").
		Order("total_amount DESC").
		Limit(limit).
		Scan(&rankings)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    rankings,
	})
}

// GetOrderStatusStats 获取订单状态分布
// @Summary 获取订单状态分布
// @Tags 管理员-数据看板
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/order-status [get]
func (h *AdminDashboardHandler) GetOrderStatusStats(c echo.Context) error {
	type StatusCount struct {
		Status string `json:"status"`
		Count  int64  `json:"count"`
	}

	var stats []StatusCount
	h.db.Table("orders").
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&stats)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    stats,
	})
}

// GetPendingCancelRequests 获取待审批取消申请
// @Summary 获取待审批取消申请
// @Tags 管理员-订单管理
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/cancel-requests [get]
func (h *AdminDashboardHandler) GetPendingCancelRequests(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	// 获取待取消的订单（简化版，实际应有取消申请表）
	var orders []models.Order
	var total int64

	query := h.db.Model(&models.Order{}).Where("status = ?", models.OrderStatusCancelled)
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Preload("Store").Preload("Supplier").
		Offset(offset).Limit(pageSize).Order("updated_at DESC").Find(&orders).Error; err != nil {
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

// AuditCancelRequest 审核取消申请请求
type AuditCancelReq struct {
	Approved     bool   `json:"approved"`
	RejectReason string `json:"rejectReason"`
}

// AuditCancelRequest 审核取消申请
// @Summary 审核取消申请
// @Tags 管理员-订单管理
// @Accept json
// @Produce json
// @Param id path int true "申请ID"
// @Param request body AuditCancelReq true "审核请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/cancel-requests/{id}/audit [post]
func (h *AdminDashboardHandler) AuditCancelRequest(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var req AuditCancelReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 审核取消申请
	if req.Approved {
		// 批准取消，状态已经是取消，无需操作
	} else {
		// 拒绝取消，恢复订单状态
		if err := h.db.Model(&models.Order{}).Where("id = ?", id).
			Update("status", models.OrderStatusPendingConfirm).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"code":    500,
				"message": "审核失败",
			})
		}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "审核完成",
	})
}

// RestoreOrderRequest 恢复订单请求
type RestoreOrderReq struct {
	Reason string `json:"reason" validate:"required"`
}

// RestoreOrder 恢复已取消订单
// @Summary 恢复已取消订单
// @Tags 管理员-订单管理
// @Accept json
// @Produce json
// @Param id path int true "订单ID"
// @Param request body RestoreOrderReq true "恢复请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/{id}/restore [post]
func (h *AdminDashboardHandler) RestoreOrder(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var req RestoreOrderReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 恢复已取消的订单
	var order models.Order
	if err := h.db.First(&order, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在",
		})
	}

	if order.Status != models.OrderStatusCancelled {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "只能恢复已取消的订单",
		})
	}

	if err := h.db.Model(&order).Updates(map[string]interface{}{
		"status":        models.OrderStatusPendingConfirm,
		"cancel_reason": nil,
	}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "恢复失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "订单已恢复",
	})
}

// AdminCancelOrderRequest 管理员取消订单请求
type AdminCancelOrderReq struct {
	Reason string `json:"reason" validate:"required"`
}

// AdminCancelOrder 管理员直接取消订单
// @Summary 管理员直接取消订单
// @Tags 管理员-订单管理
// @Accept json
// @Produce json
// @Param id path int true "订单ID"
// @Param request body AdminCancelOrderReq true "取消请求"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/{id}/cancel [post]
func (h *AdminDashboardHandler) AdminCancelOrder(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的ID",
		})
	}

	var req AdminCancelOrderReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 管理员直接取消订单
	var order models.Order
	if err := h.db.First(&order, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在",
		})
	}

	if order.Status == models.OrderStatusCancelled {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "订单已取消",
		})
	}

	if err := h.db.Model(&order).Updates(map[string]interface{}{
		"status":        models.OrderStatusCancelled,
		"cancel_reason": req.Reason,
	}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "取消失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "订单已取消",
	})
}

// GetCancelledOrders 获取已取消订单列表
// @Summary 获取已取消订单列表
// @Tags 管理员-订单管理
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/cancelled [get]
func (h *AdminDashboardHandler) GetCancelledOrders(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	var orders []models.Order
	var total int64

	query := h.db.Model(&models.Order{}).Where("status = ?", models.OrderStatusCancelled)
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Preload("Store").Preload("Supplier").
		Offset(offset).Limit(pageSize).Order("updated_at DESC").Find(&orders).Error; err != nil {
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

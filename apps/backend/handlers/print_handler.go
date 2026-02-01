package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/services"
	"gorm.io/gorm"
)

// PrintHandler 打印处理器
type PrintHandler struct {
	service *services.PrintService
}

// NewPrintHandler 创建打印处理器
func NewPrintHandler(db *gorm.DB) *PrintHandler {
	return &PrintHandler{
		service: services.NewPrintService(db),
	}
}

// GetDeliveryNote 获取送货单数据
// @Summary 获取送货单数据
// @Tags 供应商-打印
// @Param orderId path int true "订单ID"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/print/delivery-note/{orderId} [get]
func (h *PrintHandler) GetDeliveryNote(c echo.Context) error {
	orderID, err := strconv.ParseUint(c.Param("orderId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的订单ID",
		})
	}

	note, err := h.service.GetDeliveryNote(orderID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在或无法获取送货单数据",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    note,
	})
}

// GetDeliveryNoteHTML 获取送货单HTML
// @Summary 获取送货单HTML
// @Tags 供应商-打印
// @Param orderId path int true "订单ID"
// @Success 200 {string} string "HTML内容"
// @Router /supplier/print/delivery-note/{orderId}/html [get]
func (h *PrintHandler) GetDeliveryNoteHTML(c echo.Context) error {
	orderID, err := strconv.ParseUint(c.Param("orderId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "无效的订单ID",
		})
	}

	// 获取送货单数据
	note, err := h.service.GetDeliveryNote(orderID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在或无法获取送货单数据",
		})
	}

	// 生成HTML
	html, err := h.service.GenerateDeliveryNoteHTML(note)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "生成送货单HTML失败",
		})
	}

	return c.HTML(http.StatusOK, html)
}

// BatchPrintRequest 批量打印请求
type BatchPrintRequest struct {
	OrderIDs []uint64 `json:"orderIds" validate:"required,min=1"`
}

// GetBatchDeliveryNotes 批量获取送货单数据
// @Summary 批量获取送货单数据
// @Tags 供应商-打印
// @Accept json
// @Produce json
// @Param request body BatchPrintRequest true "批量打印请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/print/delivery-notes/batch [post]
func (h *PrintHandler) GetBatchDeliveryNotes(c echo.Context) error {
	var req BatchPrintRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	if len(req.OrderIDs) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "订单ID列表不能为空",
		})
	}

	notes, err := h.service.GetBatchDeliveryNotes(req.OrderIDs)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "批量获取送货单失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    notes,
	})
}

// GetOrdersForPrint 获取可打印的订单列表
// @Summary 获取可打印的订单列表
// @Tags 供应商-打印
// @Param startDate query string false "开始日期"
// @Param endDate query string false "结束日期"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/print/orders [get]
func (h *PrintHandler) GetOrdersForPrint(c echo.Context) error {
	// 从context获取供应商ID
	roleID, ok := c.Get("role_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "无法获取供应商信息",
		})
	}
	supplierID := uint64(roleID)

	// 解析查询参数
	params := &services.PrintQueryParams{}

	if startDateStr := c.QueryParam("startDate"); startDateStr != "" {
		if startDate, err := time.Parse("2006-01-02", startDateStr); err == nil {
			params.StartDate = &startDate
		}
	}

	if endDateStr := c.QueryParam("endDate"); endDateStr != "" {
		if endDate, err := time.Parse("2006-01-02", endDateStr); err == nil {
			// 设置为当天结束时间
			endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			params.EndDate = &endDate
		}
	}

	orders, err := h.service.GetOrdersForPrint(supplierID, params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "获取订单列表失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items": orders,
			"total": len(orders),
		},
	})
}

// MarkAsPrinted 标记订单已打印
// @Summary 标记订单已打印
// @Tags 供应商-打印
// @Accept json
// @Produce json
// @Param request body BatchPrintRequest true "订单ID列表"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/print/mark-printed [post]
func (h *PrintHandler) MarkAsPrinted(c echo.Context) error {
	var req BatchPrintRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	if len(req.OrderIDs) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "订单ID列表不能为空",
		})
	}

	if err := h.service.MarkAsPrinted(req.OrderIDs); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "标记打印状态失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "标记成功",
	})
}

// GetPrintTemplate 获取打印模板配置
// @Summary 获取打印模板配置
// @Tags 供应商-打印
// @Success 200 {object} map[string]interface{}
// @Router /supplier/print/template [get]
func (h *PrintHandler) GetPrintTemplate(c echo.Context) error {
	template, err := h.service.GetPrintTemplate()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "获取打印模板失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    template,
	})
}

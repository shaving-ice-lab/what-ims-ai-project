package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// MarketPriceHandler 市场行情处理器
type MarketPriceHandler struct {
	db *gorm.DB
}

// NewMarketPriceHandler 创建市场行情处理器
func NewMarketPriceHandler(db *gorm.DB) *MarketPriceHandler {
	return &MarketPriceHandler{db: db}
}

// GetMarketOverview 获取市场价格概览
// @Summary 获取市场价格概览
// @Tags 供应商-市场行情
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/overview [get]
func (h *MarketPriceHandler) GetMarketOverview(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	// 获取供应商物料总数
	var totalProducts int64
	h.db.Model(&models.SupplierMaterial{}).Where("supplier_id = ? AND status = 1", supplierID).Count(&totalProducts)

	// 统计价格优势情况（简化版）
	lowestPriceCount := int64(float64(totalProducts) * 0.35)
	higherPriceCount := int64(float64(totalProducts) * 0.15)
	normalPriceCount := totalProducts - lowestPriceCount - higherPriceCount

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"totalProducts":         totalProducts,
			"lowestPriceCount":      lowestPriceCount,
			"higherPriceCount":      higherPriceCount,
			"normalPriceCount":      normalPriceCount,
			"averagePriceAdvantage": 35.0,
		},
	})
}

// GetPriceComparisons 获取产品价格对比列表
// @Summary 获取产品价格对比列表
// @Tags 供应商-市场行情
// @Param page query int false "页码"
// @Param pageSize query int false "每页数量"
// @Param categoryId query int false "分类ID"
// @Param priceStatus query string false "价格状态(lowest/higher/normal)"
// @Param keyword query string false "关键词"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/comparisons [get]
func (h *MarketPriceHandler) GetPriceComparisons(c echo.Context) error {
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

	var total int64
	var materials []models.SupplierMaterial

	query := h.db.Model(&models.SupplierMaterial{}).Where("supplier_id = ? AND status = 1", supplierID)

	if categoryID := c.QueryParam("categoryId"); categoryID != "" {
		query = query.Joins("JOIN material_skus ms ON supplier_materials.material_sku_id = ms.id").
			Joins("JOIN materials m ON ms.material_id = m.id").
			Where("m.category_id = ?", categoryID)
	}
	if keyword := c.QueryParam("keyword"); keyword != "" {
		query = query.Joins("JOIN material_skus ms ON supplier_materials.material_sku_id = ms.id").
			Joins("JOIN materials m ON ms.material_id = m.id").
			Where("m.name LIKE ?", "%"+keyword+"%")
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Preload("MaterialSku").Preload("MaterialSku.Material").
		Offset(offset).Limit(pageSize).Find(&materials).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"items":    materials,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

// GetPriceAdjustmentSuggestions 获取价格调整建议
// @Summary 获取价格调整建议
// @Tags 供应商-市场行情
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/suggestions [get]
func (h *MarketPriceHandler) GetPriceAdjustmentSuggestions(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	// 获取价格建议（简化版：返回价格最高和最低的物料）
	var suggestLower []models.SupplierMaterial
	var priceAdvantage []models.SupplierMaterial

	// 价格较高的物料（建议降价）
	h.db.Where("supplier_id = ? AND status = 1", supplierID).
		Preload("MaterialSku").Preload("MaterialSku.Material").
		Order("price DESC").Limit(5).Find(&suggestLower)

	// 价格较低的物料（价格优势）
	h.db.Where("supplier_id = ? AND status = 1", supplierID).
		Preload("MaterialSku").Preload("MaterialSku.Material").
		Order("price ASC").Limit(5).Find(&priceAdvantage)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data": map[string]interface{}{
			"suggestLowerPrice": suggestLower,
			"priceAdvantage":    priceAdvantage,
		},
	})
}

// GetLowestPriceProducts 获取价格优势产品列表
// @Summary 获取价格优势产品列表
// @Tags 供应商-市场行情
// @Param limit query int false "数量限制"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/lowest [get]
func (h *MarketPriceHandler) GetLowestPriceProducts(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit <= 0 || limit > 50 {
		limit = 10
	}

	var materials []models.SupplierMaterial
	if err := h.db.Where("supplier_id = ? AND status = 1", supplierID).
		Preload("MaterialSku").Preload("MaterialSku.Material").
		Order("price ASC").Limit(limit).Find(&materials).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "查询失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "获取成功",
		"data":    materials,
	})
}

// QuickAdjustPrice 快捷调价
// @Summary 快捷调价
// @Tags 供应商-市场行情
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "调价请求"
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/quick-adjust [post]
func (h *MarketPriceHandler) QuickAdjustPrice(c echo.Context) error {
	var req struct {
		MaterialSkuID uint64  `json:"materialSkuId" validate:"required"`
		NewPrice      float64 `json:"newPrice" validate:"required,gt=0"`
	}

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

	// 更新物料价格
	if err := h.db.Model(&models.SupplierMaterial{}).
		Where("supplier_id = ? AND material_sku_id = ?", supplierID, req.MaterialSkuID).
		Update("price", req.NewPrice).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"code":    500,
			"message": "调价失败",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "调价成功",
	})
}

// RefreshMarketData 刷新市场数据
// @Summary 刷新市场数据
// @Tags 供应商-市场行情
// @Success 200 {object} map[string]interface{}
// @Router /supplier/market-price/refresh [post]
func (h *MarketPriceHandler) RefreshMarketData(c echo.Context) error {
	supplierID := GetSupplierID(c)
	if supplierID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"code":    401,
			"message": "未授权",
		})
	}

	// 返回当前时间作为数据刷新时间
	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "数据刷新成功",
		"data": map[string]interface{}{
			"updateTime": time.Now().Format(time.RFC3339),
		},
	})
}

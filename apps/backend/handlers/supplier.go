package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// GetSupplierMaterials 获取供应商物料列表
func GetSupplierMaterials(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
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

		query := db.Model(&models.SupplierMaterial{}).Where("supplier_id = ?", supplierID)
		query.Count(&total)
		
		offset := (page - 1) * pageSize
		err := query.Preload("MaterialSku.Material.Category").
			Offset(offset).Limit(pageSize).
			Find(&materials).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, materials, total, page, pageSize)
	}
}

// CreateSupplierMaterial 创建供应商物料
func CreateSupplierMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type CreateRequest struct {
			MaterialSkuID uint64  `json:"materialSkuId" validate:"required"`
			Price         float64 `json:"price" validate:"required,min=0"`
			OriginalPrice float64 `json:"originalPrice"`
			MinQuantity   int     `json:"minQuantity"`
			StepQuantity  int     `json:"stepQuantity"`
		}

		var req CreateRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// Check if material already exists for this supplier
		var count int64
		db.Model(&models.SupplierMaterial{}).
			Where("supplier_id = ? AND material_sku_id = ?", supplierID, req.MaterialSkuID).
			Count(&count)
		
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "该物料已存在")
		}

		material := &models.SupplierMaterial{
			SupplierID:    supplierID,
			MaterialSkuID: req.MaterialSkuID,
			Price:         req.Price,
			MinQuantity:   req.MinQuantity,
			StepQuantity:  req.StepQuantity,
			StockStatus:   models.StockStatusInStock,
			AuditStatus:   models.AuditStatusPending,
			Status:        1,
		}

		if req.OriginalPrice > 0 {
			material.OriginalPrice = &req.OriginalPrice
		}

		if err := db.Create(material).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建失败")
		}

		return SuccessResponse(c, material)
	}
}

// UpdateSupplierMaterial 更新供应商物料
func UpdateSupplierMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateRequest struct {
			Price         float64 `json:"price"`
			OriginalPrice float64 `json:"originalPrice"`
			MinQuantity   int     `json:"minQuantity"`
			StepQuantity  int     `json:"stepQuantity"`
			StockStatus   string  `json:"stockStatus"`
		}

		var req UpdateRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		var material models.SupplierMaterial
		if err := db.Where("id = ? AND supplier_id = ?", id, supplierID).First(&material).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "物料不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		updates := make(map[string]interface{})
		if req.Price > 0 {
			updates["price"] = req.Price
		}
		if req.OriginalPrice >= 0 {
			if req.OriginalPrice == 0 {
				updates["original_price"] = nil
			} else {
				updates["original_price"] = req.OriginalPrice
			}
		}
		if req.MinQuantity > 0 {
			updates["min_quantity"] = req.MinQuantity
		}
		if req.StepQuantity > 0 {
			updates["step_quantity"] = req.StepQuantity
		}
		if req.StockStatus != "" {
			updates["stock_status"] = req.StockStatus
		}

		if err := db.Model(&material).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteSupplierMaterial 删除供应商物料
func DeleteSupplierMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		result := db.Where("id = ? AND supplier_id = ?", id, supplierID).
			Delete(&models.SupplierMaterial{})
		
		if result.Error != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "删除失败")
		}
		
		if result.RowsAffected == 0 {
			return ErrorResponse(c, http.StatusNotFound, "物料不存在")
		}

		return SuccessResponse(c, nil)
	}
}

// ImportSupplierMaterials 导入供应商物料
func ImportSupplierMaterials(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现导入供应商物料
		return SuccessResponse(c, nil)
	}
}

// GetDeliverySettings 获取配送设置
func GetDeliverySettings(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		var supplier models.Supplier
		if err := db.Where("id = ?", supplierID).First(&supplier).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "供应商不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, map[string]interface{}{
			"minOrderAmount": supplier.MinOrderAmount,
			"deliveryDays": supplier.DeliveryDays,
			"deliveryMode": supplier.DeliveryMode,
		})
	}
}

// UpdateDeliverySettings 更新配送设置
func UpdateDeliverySettings(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type UpdateDeliveryRequest struct {
			MinOrderAmount float64 `json:"minOrderAmount"`
			DeliveryDays   []int   `json:"deliveryDays"`
			DeliveryMode   string  `json:"deliveryMode"`
		}

		var req UpdateDeliveryRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.MinOrderAmount >= 0 {
			updates["min_order_amount"] = req.MinOrderAmount
		}
		if len(req.DeliveryDays) > 0 {
			updates["delivery_days"] = models.DeliveryDays(req.DeliveryDays)
		}
		if req.DeliveryMode != "" {
			updates["delivery_mode"] = req.DeliveryMode
		}

		if err := db.Model(&models.Supplier{}).Where("id = ?", supplierID).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新失败")
		}

		return SuccessResponse(c, nil)
	}
}

// GetDeliveryAreas 获取配送区域
func GetDeliveryAreas(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		var areas []models.DeliveryArea
		if err := db.Where("supplier_id = ? AND status = ?", supplierID, 1).
			Find(&areas).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, areas)
	}
}

// CreateDeliveryArea 创建配送区域
func CreateDeliveryArea(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type CreateAreaRequest struct {
			Province string  `json:"province" validate:"required"`
			City     string  `json:"city" validate:"required"`
			District *string `json:"district"`
		}

		var req CreateAreaRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// Check if area already exists
		query := db.Model(&models.DeliveryArea{}).
			Where("supplier_id = ? AND province = ? AND city = ?", supplierID, req.Province, req.City)
		
		if req.District != nil {
			query = query.Where("district = ?", *req.District)
		} else {
			query = query.Where("district IS NULL")
		}
		
		var count int64
		query.Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "该配送区域已存在")
		}

		area := &models.DeliveryArea{
			SupplierID: supplierID,
			Province:   req.Province,
			City:       req.City,
			District:   req.District,
			Status:     1,
		}

		if err := db.Create(area).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建失败")
		}

		return SuccessResponse(c, area)
	}
}

// DeleteDeliveryArea 删除配送区域
func DeleteDeliveryArea(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		result := db.Where("id = ? AND supplier_id = ?", id, supplierID).
			Delete(&models.DeliveryArea{})
		
		if result.Error != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "删除失败")
		}
		
		if result.RowsAffected == 0 {
			return ErrorResponse(c, http.StatusNotFound, "配送区域不存在")
		}

		return SuccessResponse(c, nil)
	}
}

// GetSupplierStats 获取供应商统计
func GetSupplierStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取供应商统计
		return SuccessResponse(c, nil)
	}
}

// GetSupplierOrderStats 获取供应商订单统计
func GetSupplierOrderStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取供应商订单统计
		return SuccessResponse(c, nil)
	}
}

// GetSupplierMaterialStats 获取供应商物料统计
func GetSupplierMaterialStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取供应商物料统计
		return SuccessResponse(c, nil)
	}
}

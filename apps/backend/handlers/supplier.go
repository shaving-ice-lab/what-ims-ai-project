package handlers

import (
	"net/http"
	"strconv"
	"time"

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
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// 获取导入数据（前端解析Excel后提交JSON）
		type ImportItem struct {
			MaterialSkuID uint64  `json:"materialSkuId"`
			SkuNo         string  `json:"skuNo"`
			MaterialName  string  `json:"materialName"`
			Brand         string  `json:"brand"`
			Spec          string  `json:"spec"`
			Unit          string  `json:"unit"`
			Price         float64 `json:"price" validate:"required,gt=0"`
			OriginalPrice float64 `json:"originalPrice"`
			MinQuantity   int     `json:"minQuantity"`
			StepQuantity  int     `json:"stepQuantity"`
			StockStatus   string  `json:"stockStatus"`
		}

		type ImportRequest struct {
			Items []ImportItem `json:"items" validate:"required,min=1"`
		}

		var req ImportRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		// 导入结果统计
		var successCount, failCount, updateCount int
		var errors []map[string]interface{}

		// 开始事务
		tx := db.Begin()

		for i, item := range req.Items {
			// 根据SKU编号查找物料SKU
			var materialSkuID uint64
			if item.MaterialSkuID > 0 {
				materialSkuID = item.MaterialSkuID
			} else if item.SkuNo != "" {
				var sku models.MaterialSku
				if err := tx.Where("sku_no = ?", item.SkuNo).First(&sku).Error; err != nil {
					errors = append(errors, map[string]interface{}{
						"row":     i + 1,
						"skuNo":   item.SkuNo,
						"message": "SKU编号不存在",
					})
					failCount++
					continue
				}
				materialSkuID = sku.ID
			} else {
				errors = append(errors, map[string]interface{}{
					"row":     i + 1,
					"message": "缺少SKU ID或SKU编号",
				})
				failCount++
				continue
			}

			// 检查是否已存在
			var existing models.SupplierMaterial
			err := tx.Where("supplier_id = ? AND material_sku_id = ?", supplierID, materialSkuID).First(&existing).Error

			if err == nil {
				// 更新现有记录
				updates := map[string]interface{}{
					"price": item.Price,
				}
				if item.OriginalPrice > 0 {
					updates["original_price"] = item.OriginalPrice
				}
				if item.MinQuantity > 0 {
					updates["min_quantity"] = item.MinQuantity
				}
				if item.StepQuantity > 0 {
					updates["step_quantity"] = item.StepQuantity
				}
				if item.StockStatus != "" {
					updates["stock_status"] = item.StockStatus
				}

				if err := tx.Model(&existing).Updates(updates).Error; err != nil {
					errors = append(errors, map[string]interface{}{
						"row":     i + 1,
						"skuNo":   item.SkuNo,
						"message": "更新失败: " + err.Error(),
					})
					failCount++
					continue
				}
				updateCount++
			} else {
				// 创建新记录
				material := &models.SupplierMaterial{
					SupplierID:    supplierID,
					MaterialSkuID: materialSkuID,
					Price:         item.Price,
					MinQuantity:   item.MinQuantity,
					StepQuantity:  item.StepQuantity,
					StockStatus:   models.StockStatusInStock,
					AuditStatus:   models.AuditStatusPending,
					Status:        1,
				}

				if item.OriginalPrice > 0 {
					material.OriginalPrice = &item.OriginalPrice
				}
				if item.MinQuantity == 0 {
					material.MinQuantity = 1
				}
				if item.StepQuantity == 0 {
					material.StepQuantity = 1
				}
				if item.StockStatus == "out_of_stock" {
					material.StockStatus = models.StockStatusOutOfStock
				}

				if err := tx.Create(material).Error; err != nil {
					errors = append(errors, map[string]interface{}{
						"row":     i + 1,
						"skuNo":   item.SkuNo,
						"message": "创建失败: " + err.Error(),
					})
					failCount++
					continue
				}
				successCount++
			}
		}

		// 提交事务
		if err := tx.Commit().Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "导入失败")
		}

		return SuccessResponse(c, map[string]interface{}{
			"totalCount":   len(req.Items),
			"successCount": successCount,
			"updateCount":  updateCount,
			"failCount":    failCount,
			"errors":       errors,
		})
	}
}

// GetImportTemplate 获取导入模板数据
func GetImportTemplate(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// 返回导入模板的列定义和示例数据
		template := map[string]interface{}{
			"columns": []map[string]interface{}{
				{"key": "skuNo", "title": "SKU编号", "required": true, "description": "物料SKU唯一编号"},
				{"key": "materialName", "title": "物料名称", "required": false, "description": "仅供参考"},
				{"key": "brand", "title": "品牌", "required": false, "description": "仅供参考"},
				{"key": "spec", "title": "规格", "required": false, "description": "仅供参考"},
				{"key": "unit", "title": "单位", "required": false, "description": "仅供参考"},
				{"key": "price", "title": "报价", "required": true, "description": "供应商报价，必填"},
				{"key": "originalPrice", "title": "原价", "required": false, "description": "用于显示划线价"},
				{"key": "minQuantity", "title": "最小起订量", "required": false, "description": "默认1"},
				{"key": "stepQuantity", "title": "步进数量", "required": false, "description": "默认1"},
				{"key": "stockStatus", "title": "库存状态", "required": false, "description": "in_stock/out_of_stock，默认in_stock"},
			},
			"sampleData": []map[string]interface{}{
				{
					"skuNo":         "SKU001",
					"materialName":  "面粉",
					"brand":         "金龙鱼",
					"spec":          "25kg/袋",
					"unit":          "袋",
					"price":         78.00,
					"originalPrice": 85.00,
					"minQuantity":   1,
					"stepQuantity":  1,
					"stockStatus":   "in_stock",
				},
				{
					"skuNo":         "SKU002",
					"materialName":  "黄油",
					"brand":         "安佳",
					"spec":          "500g/块",
					"unit":          "块",
					"price":         50.00,
					"originalPrice": 55.00,
					"minQuantity":   5,
					"stepQuantity":  1,
					"stockStatus":   "in_stock",
				},
			},
		}

		return SuccessResponse(c, template)
	}
}

// GetImportHistory 获取导入历史记录
func GetImportHistory(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// TODO: 如果需要持久化导入历史，需要创建ImportHistory模型
		// 这里返回空列表作为占位
		return SuccessResponse(c, map[string]interface{}{
			"items": []interface{}{},
			"total": 0,
		})
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
			"deliveryDays":   supplier.DeliveryDays,
			"deliveryMode":   supplier.DeliveryMode,
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
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		now := time.Now()
		monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

		var totalOrders, monthlyOrders, pendingOrders int64
		var totalAmount, monthlyAmount float64
		var materialCount int64

		// 总订单数和金额
		db.Model(&models.Order{}).Where("supplier_id = ?", supplierID).Count(&totalOrders)
		db.Model(&models.Order{}).Where("supplier_id = ? AND status != ?", supplierID, models.OrderStatusCancelled).
			Select("COALESCE(SUM(total_amount), 0)").Scan(&totalAmount)

		// 本月订单数和金额
		db.Model(&models.Order{}).Where("supplier_id = ? AND created_at >= ?", supplierID, monthStart).Count(&monthlyOrders)
		db.Model(&models.Order{}).Where("supplier_id = ? AND created_at >= ? AND status != ?", supplierID, monthStart, models.OrderStatusCancelled).
			Select("COALESCE(SUM(total_amount), 0)").Scan(&monthlyAmount)

		// 待处理订单
		db.Model(&models.Order{}).Where("supplier_id = ? AND status = ?", supplierID, models.OrderStatusPendingConfirm).Count(&pendingOrders)

		// 物料数量
		db.Model(&models.SupplierMaterial{}).Where("supplier_id = ? AND status = 1", supplierID).Count(&materialCount)

		return SuccessResponse(c, map[string]interface{}{
			"totalOrders":   totalOrders,
			"totalAmount":   totalAmount,
			"monthlyOrders": monthlyOrders,
			"monthlyAmount": monthlyAmount,
			"pendingOrders": pendingOrders,
			"materialCount": materialCount,
		})
	}
}

// GetSupplierOrderStats 获取供应商订单统计
func GetSupplierOrderStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// 获取近七天订单统计
		now := time.Now()
		sevenDaysAgo := now.AddDate(0, 0, -7)

		type DailyStats struct {
			Date        string  `json:"date"`
			OrderCount  int64   `json:"orderCount"`
			TotalAmount float64 `json:"totalAmount"`
		}

		var stats []DailyStats
		db.Table("orders").
			Select("DATE(created_at) as date, COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_amount").
			Where("supplier_id = ? AND created_at >= ? AND status != ?", supplierID, sevenDaysAgo, models.OrderStatusCancelled).
			Group("DATE(created_at)").
			Order("date DESC").
			Scan(&stats)

		return SuccessResponse(c, stats)
	}
}

// GetSupplierMaterialStats 获取供应商物料统计
func GetSupplierMaterialStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// 获取物料分类统计
		type CategoryStats struct {
			CategoryID    uint64 `json:"categoryId"`
			CategoryName  string `json:"categoryName"`
			MaterialCount int64  `json:"materialCount"`
		}

		var stats []CategoryStats
		db.Table("supplier_materials sm").
			Select("c.id as category_id, c.name as category_name, COUNT(*) as material_count").
			Joins("JOIN material_skus ms ON sm.material_sku_id = ms.id").
			Joins("JOIN materials m ON ms.material_id = m.id").
			Joins("JOIN categories c ON m.category_id = c.id").
			Where("sm.supplier_id = ? AND sm.status = 1 AND sm.deleted_at IS NULL", supplierID).
			Group("c.id, c.name").
			Order("material_count DESC").
			Scan(&stats)

		return SuccessResponse(c, stats)
	}
}

// BatchUpdatePrice 批量更新物料价格
func BatchUpdatePrice(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type BatchUpdatePriceRequest struct {
			MaterialSkuIDs []uint64 `json:"materialSkuIds" validate:"required,min=1"`
			AdjustType     string   `json:"adjustType" validate:"required,oneof=fixed percent"`
			AdjustValue    float64  `json:"adjustValue" validate:"required"`
		}

		var req BatchUpdatePriceRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 在事务中批量更新价格
		var updatedCount int64
		err := db.Transaction(func(tx *gorm.DB) error {
			for _, skuID := range req.MaterialSkuIDs {
				var material models.SupplierMaterial
				if err := tx.Where("supplier_id = ? AND material_sku_id = ?", supplierID, skuID).First(&material).Error; err != nil {
					continue // 跳过不存在的记录
				}

				var newPrice float64
				if req.AdjustType == "fixed" {
					// 固定金额调价
					newPrice = material.Price + req.AdjustValue
				} else {
					// 百分比调价
					newPrice = material.Price * (1 + req.AdjustValue/100)
				}

				// 确保价格不为负
				if newPrice < 0 {
					newPrice = 0
				}

				// 四舍五入到两位小数
				newPrice = float64(int(newPrice*100+0.5)) / 100

				if err := tx.Model(&material).Update("price", newPrice).Error; err != nil {
					return err
				}
				updatedCount++
			}
			return nil
		})

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "批量更新失败")
		}

		return SuccessResponse(c, map[string]interface{}{
			"updatedCount": updatedCount,
			"message":      "批量调价成功",
		})
	}
}

// BatchUpdateStockStatus 批量更新库存状态
func BatchUpdateStockStatus(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type BatchUpdateStockRequest struct {
			MaterialSkuIDs []uint64 `json:"materialSkuIds" validate:"required,min=1"`
			StockStatus    string   `json:"stockStatus" validate:"required,oneof=in_stock out_of_stock"`
		}

		var req BatchUpdateStockRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		result := db.Model(&models.SupplierMaterial{}).
			Where("supplier_id = ? AND material_sku_id IN ?", supplierID, req.MaterialSkuIDs).
			Update("stock_status", req.StockStatus)

		if result.Error != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "批量更新失败")
		}

		return SuccessResponse(c, map[string]interface{}{
			"updatedCount": result.RowsAffected,
			"message":      "批量更新库存状态成功",
		})
	}
}

// GetPriceComparisonStats 获取价格对比统计
func GetPriceComparisonStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// 获取该供应商的所有物料及其市场价格对比
		type PriceComparison struct {
			MaterialSkuID uint64  `json:"materialSkuId"`
			MaterialName  string  `json:"materialName"`
			Brand         string  `json:"brand"`
			Spec          string  `json:"spec"`
			MyPrice       float64 `json:"myPrice"`
			LowestPrice   float64 `json:"lowestPrice"`
			HighestPrice  float64 `json:"highestPrice"`
			AvgPrice      float64 `json:"avgPrice"`
			SupplierCount int     `json:"supplierCount"`
			PriceDiff     float64 `json:"priceDiff"`
			PriceDiffRate float64 `json:"priceDiffRate"`
			IsLowest      bool    `json:"isLowest"`
			IsHighest     bool    `json:"isHighest"`
		}

		var comparisons []PriceComparison

		// 子查询获取每个SKU的市场价格统计
		subQuery := db.Table("supplier_materials").
			Select("material_sku_id, MIN(price) as lowest_price, MAX(price) as highest_price, AVG(price) as avg_price, COUNT(DISTINCT supplier_id) as supplier_count").
			Where("status = 1 AND audit_status = 'approved'").
			Group("material_sku_id")

		err := db.Table("supplier_materials sm").
			Select(`
				sm.material_sku_id,
				ms.name as material_name,
				ms.brand,
				ms.spec,
				sm.price as my_price,
				market.lowest_price,
				market.highest_price,
				market.avg_price,
				market.supplier_count,
				(sm.price - market.lowest_price) as price_diff,
				CASE WHEN market.lowest_price > 0 THEN ((sm.price - market.lowest_price) / market.lowest_price * 100) ELSE 0 END as price_diff_rate,
				(sm.price = market.lowest_price) as is_lowest,
				(sm.price = market.highest_price) as is_highest
			`).
			Joins("JOIN material_skus ms ON ms.id = sm.material_sku_id").
			Joins("JOIN (?) as market ON market.material_sku_id = sm.material_sku_id", subQuery).
			Where("sm.supplier_id = ? AND sm.status = 1 AND sm.audit_status = 'approved'", supplierID).
			Order("price_diff_rate DESC").
			Scan(&comparisons).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 统计汇总
		var totalProducts int
		var lowestCount int
		var highestCount int
		var avgDiffRate float64

		for _, comp := range comparisons {
			totalProducts++
			if comp.IsLowest {
				lowestCount++
			}
			if comp.IsHighest && comp.SupplierCount > 1 {
				highestCount++
			}
			avgDiffRate += comp.PriceDiffRate
		}

		if totalProducts > 0 {
			avgDiffRate = avgDiffRate / float64(totalProducts)
		}

		return SuccessResponse(c, map[string]interface{}{
			"summary": map[string]interface{}{
				"totalProducts":     totalProducts,
				"lowestPriceCount":  lowestCount,
				"highestPriceCount": highestCount,
				"avgPriceDiffRate":  avgDiffRate,
			},
			"comparisons": comparisons,
		})
	}
}

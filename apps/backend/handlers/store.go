package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// GetStoreMaterials 门店获取物料列表
func GetStoreMaterials(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
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
		var materials []models.Material

		query := db.Model(&models.Material{}).Where("status = ?", 1)

		// 按分类筛选
		categoryID := c.QueryParam("categoryId")
		if categoryID != "" {
			query = query.Where("category_id = ?", categoryID)
		}

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("name LIKE ?", "%"+keyword+"%")
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Category").Preload("MaterialSkus").
			Offset(offset).Limit(pageSize).
			Find(&materials).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, materials, total, page, pageSize)
	}
}

// GetMaterialDetail 获取物料详情
func GetMaterialDetail(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		var material models.Material
		if err := db.Preload("Category").Preload("MaterialSkus").
			First(&material, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "物料不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, material)
	}
}

// GetMaterialSuppliers 获取物料供应商
func GetMaterialSuppliers(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		skuID, err := strconv.ParseUint(c.Param("skuId"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的SKU ID")
		}

		var supplierMaterials []models.SupplierMaterial
		if err := db.Where("material_sku_id = ? AND status = ? AND audit_status = ?", 
			skuID, 1, models.AuditStatusApproved).
			Preload("Supplier").
			Order("price ASC").
			Find(&supplierMaterials).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, supplierMaterials)
	}
}

// GetCart 获取购物车
func GetCart(redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		supplierID := c.QueryParam("supplierId")
		if supplierID == "" {
			return ErrorResponse(c, http.StatusBadRequest, "供应商ID不能为空")
		}

		key := fmt.Sprintf("cart:store:%d:supplier:%s", storeID, supplierID)
		ctx := context.Background()

		data, err := redis.Get(ctx, key).Result()
		if err == redis.Nil {
			return SuccessResponse(c, map[string]interface{}{
				"items": []interface{}{},
				"total": 0,
			})
		} else if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "获取购物车失败")
		}

		var cart map[string]interface{}
		if err := json.Unmarshal([]byte(data), &cart); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "解析购物车数据失败")
		}

		return SuccessResponse(c, cart)
	}
}

// AddToCart 添加到购物车
func AddToCart(redis *redis.Client, db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type AddToCartRequest struct {
			SupplierID        uint64  `json:"supplierId" validate:"required"`
			SupplierMaterialID uint64  `json:"supplierMaterialId" validate:"required"`
			Quantity          int     `json:"quantity" validate:"required,min=1"`
			UnitPrice         float64 `json:"unitPrice" validate:"required"`
			FinalPrice        float64 `json:"finalPrice" validate:"required"`
		}

		var req AddToCartRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 获取供应商物料信息
		var supplierMaterial models.SupplierMaterial
		if err := db.Preload("MaterialSku.Material").
			First(&supplierMaterial, req.SupplierMaterialID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "供应商物料不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		key := fmt.Sprintf("cart:store:%d:supplier:%d", storeID, req.SupplierID)
		ctx := context.Background()

		// 获取现有购物车数据
		var cart map[string]interface{}
		data, err := redis.Get(ctx, key).Result()
		if err == redis.Nil {
			cart = map[string]interface{}{
				"items": []map[string]interface{}{},
				"total": 0.0,
			}
		} else if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "获取购物车失败")
		} else {
			if err := json.Unmarshal([]byte(data), &cart); err != nil {
				return ErrorResponse(c, http.StatusInternalServerError, "解析购物车数据失败")
			}
		}

		// 添加或更新购物车项
		items := cart["items"].([]interface{})
		found := false
		for i, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				if uint64(itemMap["supplierMaterialId"].(float64)) == req.SupplierMaterialID {
					itemMap["quantity"] = itemMap["quantity"].(float64) + float64(req.Quantity)
					itemMap["subtotal"] = itemMap["quantity"].(float64) * req.FinalPrice
					items[i] = itemMap
					found = true
					break
				}
			}
		}

		if !found {
			newItem := map[string]interface{}{
				"supplierMaterialId": req.SupplierMaterialID,
				"materialSkuId":      supplierMaterial.MaterialSkuID,
				"materialName":       supplierMaterial.MaterialSku.Material.Name,
				"brand":              supplierMaterial.MaterialSku.Brand,
				"spec":               supplierMaterial.MaterialSku.Spec,
				"unit":               supplierMaterial.MaterialSku.Unit,
				"imageUrl":           supplierMaterial.MaterialSku.ImageURL,
				"quantity":           req.Quantity,
				"unitPrice":          req.UnitPrice,
				"finalPrice":         req.FinalPrice,
				"subtotal":           req.FinalPrice * float64(req.Quantity),
			}
			items = append(items, newItem)
		}

		// 计算总金额
		total := 0.0
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				total += itemMap["subtotal"].(float64)
			}
		}

		cart["items"] = items
		cart["total"] = total

		// 保存购物车数据
		cartData, err := json.Marshal(cart)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "序列化购物车数据失败")
		}

		if err := redis.Set(ctx, key, cartData, 7*24*time.Hour).Err(); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "保存购物车失败")
		}

		return SuccessResponse(c, cart)
	}
}

// UpdateCartItem 更新购物车商品
func UpdateCartItem(redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type UpdateCartRequest struct {
			SupplierID        uint64 `json:"supplierId" validate:"required"`
			SupplierMaterialID uint64 `json:"supplierMaterialId" validate:"required"`
			Quantity          int    `json:"quantity" validate:"required,min=0"`
		}

		var req UpdateCartRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		key := fmt.Sprintf("cart:store:%d:supplier:%d", storeID, req.SupplierID)
		ctx := context.Background()

		// 获取现有购物车数据
		data, err := redis.Get(ctx, key).Result()
		if err != nil {
			return ErrorResponse(c, http.StatusNotFound, "购物车不存在")
		}

		var cart map[string]interface{}
		if err := json.Unmarshal([]byte(data), &cart); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "解析购物车数据失败")
		}

		// 更新或删除购物车项
		items := cart["items"].([]interface{})
		newItems := []interface{}{}
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				if uint64(itemMap["supplierMaterialId"].(float64)) == req.SupplierMaterialID {
					if req.Quantity > 0 {
						itemMap["quantity"] = float64(req.Quantity)
						itemMap["subtotal"] = float64(req.Quantity) * itemMap["finalPrice"].(float64)
						newItems = append(newItems, itemMap)
					}
				} else {
					newItems = append(newItems, item)
				}
			}
		}

		// 重新计算总金额
		total := 0.0
		for _, item := range newItems {
			if itemMap, ok := item.(map[string]interface{}); ok {
				total += itemMap["subtotal"].(float64)
			}
		}

		cart["items"] = newItems
		cart["total"] = total

		// 保存购物车数据
		cartData, err := json.Marshal(cart)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "序列化购物车数据失败")
		}

		if err := redis.Set(ctx, key, cartData, 7*24*time.Hour).Err(); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "保存购物车失败")
		}

		return SuccessResponse(c, cart)
	}
}

// RemoveFromCart 从购物车移除
func RemoveFromCart(redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		supplierID, err := strconv.ParseUint(c.Param("supplierId"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的供应商ID")
		}

		supplierMaterialID, err := strconv.ParseUint(c.Param("materialId"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的物料ID")
		}

		key := fmt.Sprintf("cart:store:%d:supplier:%d", storeID, supplierID)
		ctx := context.Background()

		// 获取现有购物车数据
		data, err := redis.Get(ctx, key).Result()
		if err != nil {
			return ErrorResponse(c, http.StatusNotFound, "购物车不存在")
		}

		var cart map[string]interface{}
		if err := json.Unmarshal([]byte(data), &cart); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "解析购物车数据失败")
		}

		// 移除购物车项
		items := cart["items"].([]interface{})
		newItems := []interface{}{}
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				if uint64(itemMap["supplierMaterialId"].(float64)) != supplierMaterialID {
					newItems = append(newItems, item)
				}
			}
		}

		// 重新计算总金额
		total := 0.0
		for _, item := range newItems {
			if itemMap, ok := item.(map[string]interface{}); ok {
				total += itemMap["subtotal"].(float64)
			}
		}

		cart["items"] = newItems
		cart["total"] = total

		// 保存购物车数据
		cartData, err := json.Marshal(cart)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "序列化购物车数据失败")
		}

		if err := redis.Set(ctx, key, cartData, 7*24*time.Hour).Err(); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "保存购物车失败")
		}

		return SuccessResponse(c, nil)
	}
}

// ClearCart 清空购物车
func ClearCart(redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		supplierID, err := strconv.ParseUint(c.Param("supplierId"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的供应商ID")
		}

		key := fmt.Sprintf("cart:store:%d:supplier:%d", storeID, supplierID)
		ctx := context.Background()

		if err := redis.Del(ctx, key).Err(); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "清空购物车失败")
		}

		return SuccessResponse(c, nil)
	}
}

// GetMarketPrices 获取市场价格
func GetMarketPrices(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取市场价格
		return SuccessResponse(c, []interface{}{})
	}
}

// ComparePrices 比较价格
func ComparePrices(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现比较价格
		return SuccessResponse(c, []interface{}{})
	}
}

// GetStoreStats 获取门店统计
func GetStoreStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		now := time.Now()
		monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

		var totalOrders, monthlyOrders int64
		var totalAmount, monthlyAmount float64

		// 总订单数和金额
		db.Model(&models.Order{}).
			Where("store_id = ?", storeID).
			Count(&totalOrders)

		db.Model(&models.Order{}).
			Where("store_id = ? AND status != ?", storeID, models.OrderStatusCancelled).
			Select("COALESCE(SUM(total_amount), 0)").
			Scan(&totalAmount)

		// 本月订单数和金额
		db.Model(&models.Order{}).
			Where("store_id = ? AND created_at >= ?", storeID, monthStart).
			Count(&monthlyOrders)

		db.Model(&models.Order{}).
			Where("store_id = ? AND created_at >= ? AND status != ?", storeID, monthStart, models.OrderStatusCancelled).
			Select("COALESCE(SUM(total_amount), 0)").
			Scan(&monthlyAmount)

		return SuccessResponse(c, map[string]interface{}{
			"totalOrders": totalOrders,
			"totalAmount": totalAmount,
			"monthlyOrders": monthlyOrders,
			"monthlyAmount": monthlyAmount,
		})
	}
}

// GetStoreOrderStats 获取门店订单统计
func GetStoreOrderStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取门店订单统计
		return SuccessResponse(c, []interface{}{})
	}
}

// GetStoreCategoryStats 获取门店分类统计
func GetStoreCategoryStats(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取门店分类统计
		return SuccessResponse(c, []interface{}{})
	}
}

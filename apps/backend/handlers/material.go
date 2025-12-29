package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// GetCategories 获取分类列表
func GetCategories(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		// 获取树形结构
		tree := c.QueryParam("tree")
		if tree == "true" {
			// 查询所有分类
			var categories []models.Category
			if err := db.Order("sort_order ASC, id ASC").Find(&categories).Error; err != nil {
				return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
			}

			// 构建树形结构
			categoryMap := make(map[uint64][]models.Category)
			var rootCategories []models.Category

			for _, cat := range categories {
				if cat.ParentID == nil || *cat.ParentID == 0 {
					rootCategories = append(rootCategories, cat)
				} else {
					categoryMap[*cat.ParentID] = append(categoryMap[*cat.ParentID], cat)
				}
			}

			// 构建树
			var buildTree func(cats []models.Category) []map[string]interface{}
			buildTree = func(cats []models.Category) []map[string]interface{} {
				var result []map[string]interface{}
				for _, cat := range cats {
					node := map[string]interface{}{
						"id":        cat.ID,
						"name":      cat.Name,
						"level":     cat.Level,
						"sortOrder": cat.SortOrder,
						"status":    cat.Status,
					}
					if children, ok := categoryMap[cat.ID]; ok {
						node["children"] = buildTree(children)
					}
					result = append(result, node)
				}
				return result
			}

			return SuccessResponse(c, buildTree(rootCategories))
		}

		// 平铺列表
		page, _ := strconv.Atoi(c.QueryParam("page"))
		if page <= 0 {
			page = 1
		}
		pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}

		var total int64
		var categories []models.Category

		query := db.Model(&models.Category{})

		// 按层级筛选
		level := c.QueryParam("level")
		if level != "" {
			query = query.Where("level = ?", level)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Order("sort_order ASC, id ASC").
			Offset(offset).Limit(pageSize).
			Find(&categories).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, categories, total, page, pageSize)
	}
}

// CreateCategory 创建分类
func CreateCategory(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateCategoryRequest struct {
			Name      string  `json:"name" validate:"required"`
			ParentID  *uint64 `json:"parentId"`
			Level     int     `json:"level"`
			SortOrder int     `json:"sortOrder"`
		}

		var req CreateCategoryRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		category := &models.Category{
			Name:      req.Name,
			Level:     req.Level,
			SortOrder: req.SortOrder,
			Status:    1,
		}

		if req.ParentID != nil && *req.ParentID > 0 {
			category.ParentID = req.ParentID
			// 自动设置层级
			var parent models.Category
			if err := db.First(&parent, *req.ParentID).Error; err == nil {
				category.Level = parent.Level + 1
			}
		}

		if err := db.Create(category).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建分类失败")
		}

		return SuccessResponse(c, category)
	}
}

// UpdateCategory 更新分类
func UpdateCategory(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateCategoryRequest struct {
			Name      string `json:"name"`
			SortOrder int    `json:"sortOrder"`
			Status    uint8  `json:"status"`
		}

		var req UpdateCategoryRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.SortOrder >= 0 {
			updates["sort_order"] = req.SortOrder
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}

		if err := db.Model(&models.Category{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新分类失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteCategory 删除分类
func DeleteCategory(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现删除分类
		return SuccessResponse(c, nil)
	}
}

// GetMaterials 获取物料列表
func GetMaterials(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
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

		query := db.Model(&models.Material{})

		// 按分类筛选
		categoryID := c.QueryParam("categoryId")
		if categoryID != "" {
			query = query.Where("category_id = ?", categoryID)
		}

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("name LIKE ? OR code LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
		}

		// 状态筛选
		status := c.QueryParam("status")
		if status != "" {
			query = query.Where("status = ?", status)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Category").Preload("MaterialSkus").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&materials).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, materials, total, page, pageSize)
	}
}

// CreateMaterial 创建物料
func CreateMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateMaterialRequest struct {
			CategoryID  uint64 `json:"categoryId" validate:"required"`
			Code        string `json:"code" validate:"required"`
			Name        string `json:"name" validate:"required"`
			Description string `json:"description"`
		}

		var req CreateMaterialRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 检查编码是否已存在
		var count int64
		db.Model(&models.Material{}).Where("code = ?", req.Code).Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "物料编码已存在")
		}

		material := &models.Material{
			CategoryID:  req.CategoryID,
			Code:        req.Code,
			Name:        req.Name,
			Description: &req.Description,
			Status:      1,
		}

		if err := db.Create(material).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建物料失败")
		}

		return SuccessResponse(c, material)
	}
}

// UpdateMaterial 更新物料
func UpdateMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateMaterialRequest struct {
			CategoryID  uint64 `json:"categoryId"`
			Name        string `json:"name"`
			Description string `json:"description"`
			Status      uint8  `json:"status"`
		}

		var req UpdateMaterialRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.CategoryID > 0 {
			updates["category_id"] = req.CategoryID
		}
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}

		if err := db.Model(&models.Material{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新物料失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteMaterial 删除物料
func DeleteMaterial(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		// 检查是否有关联的SKU
		var skuCount int64
		db.Model(&models.MaterialSku{}).Where("material_id = ?", id).Count(&skuCount)
		if skuCount > 0 {
			return ErrorResponse(c, http.StatusConflict, "该物料下存在SKU，无法删除")
		}

		if err := db.Delete(&models.Material{}, id).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "删除物料失败")
		}

		return SuccessResponse(c, nil)
	}
}

// GetMaterialSkus 获取物料SKU列表
func GetMaterialSkus(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		page, _ := strconv.Atoi(c.QueryParam("page"))
		if page <= 0 {
			page = 1
		}
		pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}

		var total int64
		var skus []models.MaterialSku

		query := db.Model(&models.MaterialSku{})

		// 按物料ID筛选
		materialID := c.QueryParam("materialId")
		if materialID != "" {
			query = query.Where("material_id = ?", materialID)
		}

		// 按品牌筛选
		brand := c.QueryParam("brand")
		if brand != "" {
			query = query.Where("brand = ?", brand)
		}

		// 按条码搜索
		barcode := c.QueryParam("barcode")
		if barcode != "" {
			query = query.Where("barcode = ?", barcode)
		}

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("brand LIKE ? OR spec LIKE ? OR barcode LIKE ?", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Material.Category").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&skus).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, skus, total, page, pageSize)
	}
}

// CreateMaterialSku 创建物料SKU
func CreateMaterialSku(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateSkuRequest struct {
			MaterialID uint64  `json:"materialId" validate:"required"`
			Brand      string  `json:"brand" validate:"required"`
			Spec       string  `json:"spec" validate:"required"`
			Unit       string  `json:"unit" validate:"required"`
			Barcode    *string `json:"barcode"`
			ImageURL   *string `json:"imageUrl"`
			PackSize   int     `json:"packSize"`
		}

		var req CreateSkuRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 检查条码是否已存在
		if req.Barcode != nil && *req.Barcode != "" {
			var count int64
			db.Model(&models.MaterialSku{}).Where("barcode = ?", *req.Barcode).Count(&count)
			if count > 0 {
				return ErrorResponse(c, http.StatusConflict, "条码已存在")
			}
		}

		sku := &models.MaterialSku{
			MaterialID: req.MaterialID,
			Brand:      req.Brand,
			Spec:       req.Spec,
			Unit:       req.Unit,
			Barcode:    req.Barcode,
			ImageURL:   req.ImageURL,
			PackSize:   req.PackSize,
			Status:     1,
		}

		if err := db.Create(sku).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建SKU失败")
		}

		return SuccessResponse(c, sku)
	}
}

// UpdateMaterialSku 更新物料SKU
func UpdateMaterialSku(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateSkuRequest struct {
			Brand    string  `json:"brand"`
			Spec     string  `json:"spec"`
			Unit     string  `json:"unit"`
			Barcode  *string `json:"barcode"`
			ImageURL *string `json:"imageUrl"`
			PackSize int     `json:"packSize"`
			Status   uint8   `json:"status"`
		}

		var req UpdateSkuRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.Brand != "" {
			updates["brand"] = req.Brand
		}
		if req.Spec != "" {
			updates["spec"] = req.Spec
		}
		if req.Unit != "" {
			updates["unit"] = req.Unit
		}
		if req.Barcode != nil {
			updates["barcode"] = req.Barcode
		}
		if req.ImageURL != nil {
			updates["image_url"] = req.ImageURL
		}
		if req.PackSize > 0 {
			updates["pack_size"] = req.PackSize
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}

		if err := db.Model(&models.MaterialSku{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新SKU失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteMaterialSku 删除物料SKU
func DeleteMaterialSku(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		// 检查是否有供应商报价
		var supplierCount int64
		db.Model(&models.SupplierMaterial{}).Where("material_sku_id = ?", id).Count(&supplierCount)
		if supplierCount > 0 {
			return ErrorResponse(c, http.StatusConflict, "该SKU存在供应商报价，无法删除")
		}

		// 检查是否有订单
		var orderCount int64
		db.Model(&models.OrderItem{}).Where("material_sku_id = ?", id).Count(&orderCount)
		if orderCount > 0 {
			return ErrorResponse(c, http.StatusConflict, "该SKU存在订单记录，无法删除")
		}

		if err := db.Delete(&models.MaterialSku{}, id).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "删除SKU失败")
		}

		return SuccessResponse(c, nil)
	}
}

// GetPriceMarkups 获取加价规则列表
func GetPriceMarkups(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现加价规则列表查询
		return SuccessResponse(c, []interface{}{})
	}
}

// CreatePriceMarkup 创建加价规则
func CreatePriceMarkup(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现创建加价规则
		return SuccessResponse(c, nil)
	}
}

// UpdatePriceMarkup 更新加价规则
func UpdatePriceMarkup(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现更新加价规则
		return SuccessResponse(c, nil)
	}
}

// DeletePriceMarkup 删除加价规则
func DeletePriceMarkup(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现删除加价规则
		return SuccessResponse(c, nil)
	}
}

package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// GetAdmins 获取管理员列表
func GetAdmins(db *gorm.DB) echo.HandlerFunc {
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
		var admins []models.Admin

		query := db.Model(&models.Admin{})

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("name LIKE ?", "%"+keyword+"%")
		}

		// 角色筛选
		role := c.QueryParam("role")
		if role != "" {
			query = query.Where("role = ?", role)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("User").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&admins).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, admins, total, page, pageSize)
	}
}

// CreateAdmin 创建管理员
func CreateAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateAdminRequest struct {
			Username    string   `json:"username" validate:"required"`
			Password    string   `json:"password" validate:"required,min=6"`
			Name        string   `json:"name" validate:"required"`
			Phone       string   `json:"phone" validate:"required"`
			Role        string   `json:"role" validate:"required,oneof=admin sub_admin"`
			Permissions []string `json:"permissions"`
		}

		var req CreateAdminRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 检查用户名是否已存在
		var count int64
		db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "用户名已存在")
		}

		// 开始事务
		tx := db.Begin()

		// 创建用户
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "密码加密失败")
		}

		phone := req.Phone
		user := &models.User{
			Username:     req.Username,
			PasswordHash: string(hashedPassword),
			Phone:        &phone,
			Role:         models.UserRole(req.Role),
			Status:       1,
		}

		if err := tx.Create(user).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建用户失败")
		}

		// 创建管理员
		admin := &models.Admin{
			UserID:      user.ID,
			Name:        req.Name,
			Permissions: models.Permissions(req.Permissions),
			Status:      1,
		}

		if err := tx.Create(admin).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建管理员失败")
		}

		tx.Commit()

		return SuccessResponse(c, map[string]interface{}{
			"id":       admin.ID,
			"userId":   user.ID,
			"username": user.Username,
		})
	}
}

// UpdateAdmin 更新管理员
func UpdateAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateAdminRequest struct {
			Name        string   `json:"name"`
			Phone       string   `json:"phone"`
			Role        string   `json:"role"`
			Permissions []string `json:"permissions"`
			Status      uint8    `json:"status"`
		}

		var req UpdateAdminRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		// 开始事务
		tx := db.Begin()

		// 查找管理员
		var admin models.Admin
		if err := tx.Preload("User").First(&admin, id).Error; err != nil {
			tx.Rollback()
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "管理员不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 更新管理员信息
		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.Role != "" {
			updates["role"] = req.Role
		}
		if len(req.Permissions) > 0 {
			updates["permissions"] = models.Permissions(req.Permissions)
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}

		if err := tx.Model(&admin).Updates(updates).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "更新管理员失败")
		}

		// 更新用户信息
		userUpdates := make(map[string]interface{})
		if req.Phone != "" {
			userUpdates["phone"] = req.Phone
		}
		if req.Role != "" {
			userUpdates["role"] = req.Role
		}
		if req.Status == 0 {
			userUpdates["status"] = false
		} else if req.Status == 1 {
			userUpdates["status"] = true
		}

		if len(userUpdates) > 0 {
			if err := tx.Model(&models.User{}).Where("id = ?", admin.UserID).Updates(userUpdates).Error; err != nil {
				tx.Rollback()
				return ErrorResponse(c, http.StatusInternalServerError, "更新用户信息失败")
			}
		}

		tx.Commit()

		return SuccessResponse(c, nil)
	}
}

// DeleteAdmin 删除管理员
func DeleteAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		// 防止删除自己
		currentAdminID := GetAdminID(c)
		if currentAdminID == id {
			return ErrorResponse(c, http.StatusBadRequest, "不能删除自己")
		}

		// 开始事务
		tx := db.Begin()

		// 查找管理员
		var admin models.Admin
		if err := tx.First(&admin, id).Error; err != nil {
			tx.Rollback()
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "管理员不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 防止删除主管理员
		if admin.IsPrimary == 1 {
			var primaryCount int64
			tx.Model(&models.Admin{}).Where("is_primary = ?", 1).Count(&primaryCount)
			if primaryCount <= 1 {
				tx.Rollback()
				return ErrorResponse(c, http.StatusBadRequest, "不能删除最后一个主管理员")
			}
		}

		// 删除管理员
		if err := tx.Delete(&admin).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "删除管理员失败")
		}

		// 禁用用户账号
		if err := tx.Model(&models.User{}).Where("id = ?", admin.UserID).Update("status", false).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "禁用用户失败")
		}

		tx.Commit()

		return SuccessResponse(c, nil)
	}
}

// UpdatePermissions 更新权限
func UpdatePermissions(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdatePermissionsRequest struct {
			Permissions []string `json:"permissions" validate:"required"`
		}

		var req UpdatePermissionsRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		var admin models.Admin
		if err := db.First(&admin, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "管理员不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 只有非主管理员可以更新权限
		if admin.IsPrimary == 1 {
			return ErrorResponse(c, http.StatusBadRequest, "主管理员拥有所有权限")
		}

		if err := db.Model(&admin).Update("permissions", models.Permissions(req.Permissions)).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新权限失败")
		}

		return SuccessResponse(c, nil)
	}
}

// GetSuppliers 获取供应商列表
func GetSuppliers(db *gorm.DB) echo.HandlerFunc {
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
		var suppliers []models.Supplier

		query := db.Model(&models.Supplier{})

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("name LIKE ? OR contact LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
		}

		// 状态筛选
		status := c.QueryParam("status")
		if status != "" {
			query = query.Where("status = ?", status)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("User").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&suppliers).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, suppliers, total, page, pageSize)
	}
}

// CreateSupplier 创建供应商
func CreateSupplier(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateSupplierRequest struct {
			Username       string  `json:"username" validate:"required"`
			Password       string  `json:"password" validate:"required,min=6"`
			Name           string  `json:"name" validate:"required"`
			Contact        string  `json:"contact" validate:"required"`
			Phone          string  `json:"phone" validate:"required"`
			Email          string  `json:"email"`
			Address        string  `json:"address"`
			MinOrderAmount float64 `json:"minOrderAmount"`
			DeliveryMode   string  `json:"deliveryMode"`
			DeliveryDays   []int   `json:"deliveryDays"`
		}

		var req CreateSupplierRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 检查用户名是否已存在
		var count int64
		db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "用户名已存在")
		}

		// 开始事务
		tx := db.Begin()

		// 创建用户
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "密码加密失败")
		}

		phone := req.Phone
		user := &models.User{
			Username:     req.Username,
			PasswordHash: string(hashedPassword),
			Phone:        &phone,
			Role:         models.RoleSupplier,
			Status:       1,
		}

		if err := tx.Create(user).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建用户失败")
		}

		// 创建供应商
		supplier := &models.Supplier{
			UserID:         user.ID,
			Name:           req.Name,
			ContactName:    req.Contact,
			ContactPhone:   req.Phone,
			MinOrderAmount: req.MinOrderAmount,
			DeliveryMode:   models.DeliveryMode(req.DeliveryMode),
			DeliveryDays:   models.DeliveryDays(req.DeliveryDays),
			Status:         1,
		}

		if err := tx.Create(supplier).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建供应商失败")
		}

		tx.Commit()

		return SuccessResponse(c, map[string]interface{}{
			"id":       supplier.ID,
			"userId":   user.ID,
			"username": user.Username,
		})
	}
}

// UpdateSupplier 更新供应商
func UpdateSupplier(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateSupplierRequest struct {
			Name                 string   `json:"name"`
			DisplayName          string   `json:"displayName"`
			Contact              string   `json:"contact"`
			Phone                string   `json:"phone"`
			Email                string   `json:"email"`
			Address              string   `json:"address"`
			MinOrderAmount       float64  `json:"minOrderAmount"`
			DeliveryMode         string   `json:"deliveryMode"`
			DeliveryDays         []int    `json:"deliveryDays"`
			Status               uint8    `json:"status"`
			WebhookURL           string   `json:"webhookUrl"`
			WebhookEnabled       *bool    `json:"webhookEnabled"`
			WebhookEvents        []string `json:"webhookEvents"`
			WebhookRetryTimes    *int     `json:"webhookRetryTimes"`
			WebhookRetryInterval *int     `json:"webhookRetryInterval"`
			WebhookTimeout       *int     `json:"webhookTimeout"`
		}

		var req UpdateSupplierRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.DisplayName != "" {
			updates["display_name"] = req.DisplayName
		}
		if req.Contact != "" {
			updates["contact_name"] = req.Contact
		}
		if req.Phone != "" {
			updates["contact_phone"] = req.Phone
		}
		if req.Email != "" {
			updates["email"] = req.Email
		}
		if req.Address != "" {
			updates["address"] = req.Address
		}
		if req.MinOrderAmount >= 0 {
			updates["min_order_amount"] = req.MinOrderAmount
		}
		if req.DeliveryMode != "" {
			updates["delivery_mode"] = req.DeliveryMode
		}
		if len(req.DeliveryDays) > 0 {
			updates["delivery_days"] = models.DeliveryDays(req.DeliveryDays)
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}
		if req.WebhookURL != "" {
			updates["wechat_webhook_url"] = req.WebhookURL
		}
		if req.WebhookEnabled != nil {
			if *req.WebhookEnabled {
				updates["webhook_enabled"] = 1
			} else {
				updates["webhook_enabled"] = 0
			}
		}
		if len(req.WebhookEvents) > 0 {
			updates["webhook_events"] = models.WebhookEvents(req.WebhookEvents)
		}
		if req.WebhookRetryTimes != nil {
			updates["webhook_retry_times"] = *req.WebhookRetryTimes
		}
		if req.WebhookRetryInterval != nil {
			updates["webhook_retry_interval"] = *req.WebhookRetryInterval
		}
		if req.WebhookTimeout != nil {
			updates["webhook_timeout"] = *req.WebhookTimeout
		}

		if err := db.Model(&models.Supplier{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新供应商失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteSupplier 删除供应商
func DeleteSupplier(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		// 检查是否有订单
		var orderCount int64
		db.Model(&models.Order{}).Where("supplier_id = ?", id).Count(&orderCount)
		if orderCount > 0 {
			return ErrorResponse(c, http.StatusConflict, "该供应商存在订单记录，无法删除")
		}

		// 开始事务
		tx := db.Begin()

		// 查找供应商
		var supplier models.Supplier
		if err := tx.First(&supplier, id).Error; err != nil {
			tx.Rollback()
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "供应商不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 删除供应商
		if err := tx.Delete(&supplier).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "删除供应商失败")
		}

		// 禁用用户账号
		if err := tx.Model(&models.User{}).Where("id = ?", supplier.UserID).Update("status", false).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "禁用用户失败")
		}

		tx.Commit()

		return SuccessResponse(c, nil)
	}
}

// GetStores 获取门店列表
func GetStores(db *gorm.DB) echo.HandlerFunc {
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
		var stores []models.Store

		query := db.Model(&models.Store{})

		// 搜索
		keyword := c.QueryParam("keyword")
		if keyword != "" {
			query = query.Where("name LIKE ? OR contact LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
		}

		// 按区域筛选
		province := c.QueryParam("province")
		city := c.QueryParam("city")
		if province != "" {
			query = query.Where("province = ?", province)
		}
		if city != "" {
			query = query.Where("city = ?", city)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("User").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&stores).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, stores, total, page, pageSize)
	}
}

// CreateStore 创建门店
func CreateStore(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type CreateStoreRequest struct {
			Username      string  `json:"username" validate:"required"`
			Password      string  `json:"password" validate:"required,min=6"`
			Code          string  `json:"code" validate:"required"`
			Name          string  `json:"name" validate:"required"`
			Contact       string  `json:"contact" validate:"required"`
			Phone         string  `json:"phone" validate:"required"`
			Email         string  `json:"email"`
			Province      string  `json:"province" validate:"required"`
			City          string  `json:"city" validate:"required"`
			District      string  `json:"district"`
			Address       string  `json:"address" validate:"required"`
			EnableMarkup  bool    `json:"enableMarkup"`
			MarkupMode    string  `json:"markupMode"`
			MarkupPercent float64 `json:"markupPercent"`
		}

		var req CreateStoreRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 检查用户名是否已存在
		var count int64
		db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "用户名已存在")
		}

		// 检查门店编码是否已存在
		db.Model(&models.Store{}).Where("code = ?", req.Code).Count(&count)
		if count > 0 {
			return ErrorResponse(c, http.StatusConflict, "门店编码已存在")
		}

		// 开始事务
		tx := db.Begin()

		// 创建用户
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "密码加密失败")
		}

		storePhone := req.Phone
		province := req.Province
		city := req.City
		district := req.District
		address := req.Address
		user := &models.User{
			Username:     req.Username,
			PasswordHash: string(hashedPassword),
			Phone:        &storePhone,
			Role:         models.RoleStore,
			Status:       1,
		}

		if err := tx.Create(user).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建用户失败")
		}

		// 创建门店
		store := &models.Store{
			UserID:        user.ID,
			Name:          req.Name,
			ContactName:   req.Contact,
			ContactPhone:  req.Phone,
			Province:      &province,
			City:          &city,
			District:      &district,
			Address:       &address,
			MarkupEnabled: 1,
			Status:        1,
		}

		if err := tx.Create(store).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建门店失败")
		}

		tx.Commit()

		return SuccessResponse(c, map[string]interface{}{
			"id":       store.ID,
			"userId":   user.ID,
			"username": user.Username,
			"storeNo":  store.StoreNo,
		})
	}
}

// UpdateStore 更新门店
func UpdateStore(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		type UpdateStoreRequest struct {
			Name          string  `json:"name"`
			Contact       string  `json:"contact"`
			Phone         string  `json:"phone"`
			Email         string  `json:"email"`
			Province      string  `json:"province"`
			City          string  `json:"city"`
			District      string  `json:"district"`
			Address       string  `json:"address"`
			EnableMarkup  *bool   `json:"enableMarkup"`
			MarkupMode    string  `json:"markupMode"`
			MarkupPercent float64 `json:"markupPercent"`
			Status        uint8   `json:"status"`
		}

		var req UpdateStoreRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.Contact != "" {
			updates["contact"] = req.Contact
		}
		if req.Phone != "" {
			updates["phone"] = req.Phone
		}
		if req.Email != "" {
			updates["email"] = req.Email
		}
		if req.Province != "" {
			updates["province"] = req.Province
		}
		if req.City != "" {
			updates["city"] = req.City
		}
		if req.District != "" {
			updates["district"] = req.District
		}
		if req.Address != "" {
			updates["address"] = req.Address
		}
		if req.EnableMarkup != nil {
			updates["enable_markup"] = *req.EnableMarkup
		}
		if req.MarkupMode != "" {
			updates["markup_mode"] = req.MarkupMode
		}
		if req.MarkupPercent >= 0 {
			updates["markup_percent"] = req.MarkupPercent
		}
		if req.Status == 0 || req.Status == 1 {
			updates["status"] = req.Status
		}

		if err := db.Model(&models.Store{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新门店失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeleteStore 删除门店
func DeleteStore(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		// 检查是否有订单
		var orderCount int64
		db.Model(&models.Order{}).Where("store_id = ?", id).Count(&orderCount)
		if orderCount > 0 {
			return ErrorResponse(c, http.StatusConflict, "该门店存在订单记录，无法删除")
		}

		// 开始事务
		tx := db.Begin()

		// 查找门店
		var store models.Store
		if err := tx.First(&store, id).Error; err != nil {
			tx.Rollback()
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "门店不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 删除门店
		if err := tx.Delete(&store).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "删除门店失败")
		}

		// 禁用用户账号
		if err := tx.Model(&models.User{}).Where("id = ?", store.UserID).Update("status", false).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "禁用用户失败")
		}

		tx.Commit()

		return SuccessResponse(c, nil)
	}
}

// GetSystemConfigs 获取系统配置
func GetSystemConfigs(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type SystemConfig struct {
			Key         string    `json:"key"`
			Value       string    `json:"value"`
			Description string    `json:"description"`
			UpdatedAt   time.Time `json:"updatedAt"`
		}

		// 默认系统配置
		configs := []SystemConfig{
			{
				Key:         "service_fee_rate",
				Value:       "0.003",
				Description: "平台服务费率（0.3%）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "min_order_amount",
				Value:       "100",
				Description: "最低订单金额（元）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "max_login_attempts",
				Value:       "5",
				Description: "最大登录尝试次数",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "login_lock_duration",
				Value:       "15",
				Description: "登录锁定时长（分钟）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "token_expire_hours",
				Value:       "2",
				Description: "Token有效期（小时）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "refresh_token_expire_days",
				Value:       "7",
				Description: "刷新Token有效期（天）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "order_auto_confirm_hours",
				Value:       "24",
				Description: "订单自动确认时间（小时）",
				UpdatedAt:   time.Now(),
			},
			{
				Key:         "order_auto_complete_days",
				Value:       "7",
				Description: "订单自动完成时间（天）",
				UpdatedAt:   time.Now(),
			},
		}

		return SuccessResponse(c, configs)
	}
}

// UpdateSystemConfig 更新系统配置
func UpdateSystemConfig(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		type UpdateConfigRequest struct {
			Key   string `json:"key" validate:"required"`
			Value string `json:"value" validate:"required"`
		}

		var req UpdateConfigRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 验证配置键是否有效
		validKeys := []string{
			"service_fee_rate",
			"min_order_amount",
			"max_login_attempts",
			"login_lock_duration",
			"token_expire_hours",
			"refresh_token_expire_days",
			"order_auto_confirm_hours",
			"order_auto_complete_days",
		}

		isValidKey := false
		for _, key := range validKeys {
			if key == req.Key {
				isValidKey = true
				break
			}
		}

		if !isValidKey {
			return ErrorResponse(c, http.StatusBadRequest, "无效的配置键")
		}

		// 保存到数据库的系统配置表
		var config models.SystemConfig
		result := db.Where("config_key = ?", req.Key).First(&config)
		if result.Error != nil {
			// 不存在则创建
			config = models.SystemConfig{
				ConfigKey:   req.Key,
				ConfigValue: req.Value,
				ConfigType:  "string",
			}
			if err := db.Create(&config).Error; err != nil {
				return ErrorResponse(c, http.StatusInternalServerError, "保存配置失败")
			}
		} else {
			// 存在则更新
			if err := db.Model(&config).Update("config_value", req.Value).Error; err != nil {
				return ErrorResponse(c, http.StatusInternalServerError, "更新配置失败")
			}
		}

		return SuccessResponse(c, map[string]string{
			"key":   req.Key,
			"value": req.Value,
		})
	}
}

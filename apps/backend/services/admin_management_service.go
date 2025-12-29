package services

import (
	"time"

	"gorm.io/gorm"
)

// AdminManagementService 管理员管理服务
type AdminManagementService struct {
	db *gorm.DB
}

// NewAdminManagementService 创建管理员管理服务
func NewAdminManagementService(db *gorm.DB) *AdminManagementService {
	return &AdminManagementService{db: db}
}

// AdminUser 管理员用户
type AdminUser struct {
	ID          uint64    `json:"id"`
	Username    string    `json:"username"`
	Name        string    `json:"name"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	RoleType    string    `json:"roleType"` // master, sub
	Permissions []string  `json:"permissions"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	LastLoginAt *time.Time `json:"lastLoginAt"`
}

// AdminPermission 管理员权限
type AdminPermission struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Module      string `json:"module"`
	IsSensitive bool   `json:"isSensitive"`
}

// ListAdmins 获取管理员列表
func (s *AdminManagementService) ListAdmins(page, pageSize int, keyword string) ([]AdminUser, int64, error) {
	var admins []AdminUser
	var total int64

	query := s.db.Table("admins a").
		Select(`
			a.id,
			a.username,
			a.name,
			a.phone,
			a.email,
			a.role_type,
			a.is_active,
			a.created_at,
			a.last_login_at
		`)

	if keyword != "" {
		query = query.Where("a.name LIKE ? OR a.username LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("a.created_at DESC").Offset(offset).Limit(pageSize).Scan(&admins).Error
	return admins, total, err
}

// GetAdminByID 根据ID获取管理员
func (s *AdminManagementService) GetAdminByID(id uint64) (*AdminUser, error) {
	var admin AdminUser
	err := s.db.Table("admins").Where("id = ?", id).First(&admin).Error
	if err != nil {
		return nil, err
	}

	// 获取权限列表
	var permissions []string
	s.db.Table("admin_permissions").
		Select("permission_code").
		Where("admin_id = ?", id).
		Pluck("permission_code", &permissions)
	admin.Permissions = permissions

	return &admin, nil
}

// CreateSubAdmin 创建子管理员
func (s *AdminManagementService) CreateSubAdmin(username, password, name, phone, email string, permissions []string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 创建管理员
		result := tx.Table("admins").Create(map[string]interface{}{
			"username":   username,
			"password":   password, // 应该先加密
			"name":       name,
			"phone":      phone,
			"email":      email,
			"role_type":  "sub",
			"is_active":  true,
			"created_at": time.Now(),
			"updated_at": time.Now(),
		})
		if result.Error != nil {
			return result.Error
		}

		adminID := result.RowsAffected

		// 分配权限
		for _, perm := range permissions {
			tx.Table("admin_permissions").Create(map[string]interface{}{
				"admin_id":        adminID,
				"permission_code": perm,
				"created_at":      time.Now(),
			})
		}

		return nil
	})
}

// UpdateSubAdmin 更新子管理员
func (s *AdminManagementService) UpdateSubAdmin(id uint64, name, phone, email string, permissions []string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 更新管理员信息
		err := tx.Table("admins").Where("id = ?", id).Updates(map[string]interface{}{
			"name":       name,
			"phone":      phone,
			"email":      email,
			"updated_at": time.Now(),
		}).Error
		if err != nil {
			return err
		}

		// 更新权限：先删后增
		tx.Table("admin_permissions").Where("admin_id = ?", id).Delete(nil)
		for _, perm := range permissions {
			tx.Table("admin_permissions").Create(map[string]interface{}{
				"admin_id":        id,
				"permission_code": perm,
				"created_at":      time.Now(),
			})
		}

		return nil
	})
}

// ResetAdminPassword 重置管理员密码
func (s *AdminManagementService) ResetAdminPassword(id uint64, newPassword string) error {
	return s.db.Table("admins").Where("id = ?", id).Update("password", newPassword).Error
}

// ToggleAdminStatus 切换管理员状态
func (s *AdminManagementService) ToggleAdminStatus(id uint64, isActive bool) error {
	return s.db.Table("admins").Where("id = ?", id).Update("is_active", isActive).Error
}

// GetAllPermissions 获取所有权限列表
func (s *AdminManagementService) GetAllPermissions() []AdminPermission {
	return []AdminPermission{
		{Code: "dashboard.view", Name: "查看数据看板", Module: "数据看板", IsSensitive: false},
		{Code: "order.view", Name: "查看订单", Module: "订单管理", IsSensitive: false},
		{Code: "order.manage", Name: "管理订单", Module: "订单管理", IsSensitive: false},
		{Code: "market.view", Name: "查看市场行情", Module: "市场行情", IsSensitive: false},
		{Code: "report.view", Name: "查看报表", Module: "数据报表", IsSensitive: false},
		{Code: "report.export", Name: "导出报表", Module: "数据报表", IsSensitive: false},
		{Code: "supplier.view", Name: "查看供应商", Module: "供应商管理", IsSensitive: false},
		{Code: "supplier.manage", Name: "管理供应商", Module: "供应商管理", IsSensitive: false},
		{Code: "supplier.proxy", Name: "供应商代管", Module: "供应商管理", IsSensitive: true},
		{Code: "store.view", Name: "查看门店", Module: "门店管理", IsSensitive: false},
		{Code: "store.manage", Name: "管理门店", Module: "门店管理", IsSensitive: false},
		{Code: "material.view", Name: "查看物料", Module: "物料管理", IsSensitive: false},
		{Code: "material.manage", Name: "管理物料", Module: "物料管理", IsSensitive: false},
		{Code: "audit.view", Name: "查看审核", Module: "审核管理", IsSensitive: false},
		{Code: "audit.manage", Name: "处理审核", Module: "审核管理", IsSensitive: false},
		{Code: "markup.view", Name: "查看加价", Module: "加价管理", IsSensitive: false},
		{Code: "markup.manage", Name: "管理加价", Module: "加价管理", IsSensitive: true},
		{Code: "asset.view", Name: "查看素材", Module: "素材库", IsSensitive: false},
		{Code: "asset.manage", Name: "管理素材", Module: "素材库", IsSensitive: false},
		{Code: "system.config", Name: "系统配置", Module: "系统设置", IsSensitive: true},
		{Code: "admin.manage", Name: "管理员管理", Module: "系统设置", IsSensitive: true},
	}
}

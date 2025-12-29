package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"github.com/project/backend/database"
	"github.com/project/backend/middleware"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// LoginRequest 登录请求
type LoginRequest struct {
	Username   string `json:"username" validate:"required"`
	Password   string `json:"password" validate:"required"`
	RememberMe bool   `json:"rememberMe"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	AccessToken    string                 `json:"accessToken"`
	RefreshToken   string                 `json:"refreshToken"`
	ExpiresIn      int                    `json:"expiresIn"`
	User           *UserInfo             `json:"user"`
	AvailableRoles []AvailableRole       `json:"availableRoles,omitempty"`
}

// UserInfo 用户信息
type UserInfo struct {
	ID          uint   `json:"id"`
	Username    string `json:"username"`
	Role        string `json:"role"`
	RoleID      uint   `json:"roleId,omitempty"`
	Name        string `json:"name"`
	Phone       string `json:"phone,omitempty"`
	Avatar      string `json:"avatar,omitempty"`
	Permissions []string `json:"permissions,omitempty"`
}

// AvailableRole 可用角色
type AvailableRole struct {
	Role   string `json:"role"`
	RoleID uint   `json:"roleId,omitempty"`
	Name   string `json:"name"`
}

// Login 登录
func Login(db *gorm.DB, logger *zap.Logger) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req LoginRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 查询用户
		var user database.User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusUnauthorized, "用户名或密码错误")
			}
			logger.Error("Failed to query user", zap.Error(err))
			return ErrorResponse(c, http.StatusInternalServerError, "系统错误")
		}

		// 检查账号状态
		if !user.Status {
			return ErrorResponse(c, http.StatusForbidden, "账号已被禁用")
		}

		// 检查账号锁定
		if user.LockedUntil != nil && user.LockedUntil.After(time.Now()) {
			return ErrorResponse(c, http.StatusForbidden, "账号已被锁定，请稍后重试")
		}

		// 验证密码
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			// 增加失败次数
			user.LoginFailCount++
			if user.LoginFailCount >= 5 {
				lockTime := time.Now().Add(15 * time.Minute)
				user.LockedUntil = &lockTime
			}
			db.Save(&user)
			return ErrorResponse(c, http.StatusUnauthorized, "用户名或密码错误")
		}

		// 重置失败次数
		user.LoginFailCount = 0
		user.LockedUntil = nil
		user.LastLoginAt = &[]time.Time{time.Now()}[0]
		user.LastLoginIP = c.RealIP()
		db.Save(&user)

		// 获取用户角色信息
		userInfo, availableRoles, err := getUserRoleInfo(db, &user)
		if err != nil {
			logger.Error("Failed to get user role info", zap.Error(err))
			return ErrorResponse(c, http.StatusInternalServerError, "获取用户信息失败")
		}

		// 生成Token
		sessionID := generateSessionID()
		accessToken, err := middleware.GenerateToken(
			user.ID, 
			user.Role, 
			userInfo.RoleID, 
			sessionID, 
			"your-jwt-secret-key-change-in-production", // TODO: 从配置读取
			2*time.Hour,
		)
		if err != nil {
			logger.Error("Failed to generate access token", zap.Error(err))
			return ErrorResponse(c, http.StatusInternalServerError, "生成Token失败")
		}

		// 根据"记住我"选项设置refreshToken有效期
		// 默认7天，勾选"记住我"则延长至30天
		refreshTokenExpiry := 7 * 24 * time.Hour
		if req.RememberMe {
			refreshTokenExpiry = 30 * 24 * time.Hour
		}

		refreshToken, err := middleware.GenerateToken(
			user.ID,
			user.Role,
			userInfo.RoleID,
			sessionID,
			"your-jwt-secret-key-change-in-production", // TODO: 从配置读取
			refreshTokenExpiry,
		)
		if err != nil {
			logger.Error("Failed to generate refresh token", zap.Error(err))
			return ErrorResponse(c, http.StatusInternalServerError, "生成Token失败")
		}

		// 计算refreshToken过期时间（秒）
		refreshExpiresIn := int(refreshTokenExpiry.Seconds())

		response := LoginResponse{
			AccessToken:    accessToken,
			RefreshToken:   refreshToken,
			ExpiresIn:      7200, // accessToken 2小时
			User:           userInfo,
			AvailableRoles: availableRoles,
		}

		// 如果客户端需要知道refreshToken的过期时间，可以通过header返回
		c.Response().Header().Set("X-Refresh-Expires-In", fmt.Sprintf("%d", refreshExpiresIn))

		return SuccessResponse(c, response)
	}
}

// RefreshToken 刷新Token
func RefreshToken(db *gorm.DB, redis *redis.Client, logger *zap.Logger) echo.HandlerFunc {
	return func(c echo.Context) error {
		type RefreshRequest struct {
			RefreshToken string `json:"refreshToken" validate:"required"`
		}

		var req RefreshRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		// TODO: 解析refresh token，验证有效性，生成新的access token

		return SuccessResponse(c, map[string]string{
			"accessToken": "new-access-token",
			"refreshToken": req.RefreshToken,
		})
	}
}

// Logout 登出
func Logout(redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 将token加入黑名单
		
		return SuccessResponse(c, nil)
	}
}

// SelectRole 选择角色（多角色用户）
func SelectRole(db *gorm.DB, redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		type SelectRoleRequest struct {
			Role   string `json:"role" validate:"required"`
			RoleID uint   `json:"roleId"`
		}

		var req SelectRoleRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		userID := GetUserID(c)
		if userID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		// TODO: 验证用户是否有该角色权限，生成新的token

		return SuccessResponse(c, map[string]string{
			"token": "new-token-with-selected-role",
		})
	}
}

// GetUserRoles 获取用户角色列表
func GetUserRoles(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userID := GetUserID(c)
		if userID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		var user database.User
		if err := db.First(&user, userID).Error; err != nil {
			return ErrorResponse(c, http.StatusNotFound, "用户不存在")
		}

		_, availableRoles, err := getUserRoleInfo(db, &user)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "获取角色信息失败")
		}

		return SuccessResponse(c, availableRoles)
	}
}

// GetUserProfile 获取用户资料
func GetUserProfile(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userID := GetUserID(c)
		if userID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		var user database.User
		if err := db.First(&user, userID).Error; err != nil {
			return ErrorResponse(c, http.StatusNotFound, "用户不存在")
		}

		userInfo, _, err := getUserRoleInfo(db, &user)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "获取用户信息失败")
		}

		return SuccessResponse(c, userInfo)
	}
}

// UpdateUserProfile 更新用户资料
func UpdateUserProfile(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userID := GetUserID(c)
		if userID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type UpdateProfileRequest struct {
			Phone  string `json:"phone"`
			Email  string `json:"email"`
			Avatar string `json:"avatar"`
		}

		var req UpdateProfileRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		updates := map[string]interface{}{}
		if req.Phone != "" {
			updates["phone"] = req.Phone
		}
		if req.Email != "" {
			updates["email"] = req.Email
		}
		if req.Avatar != "" {
			updates["avatar"] = req.Avatar
		}

		if err := db.Model(&database.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "更新失败")
		}

		return SuccessResponse(c, nil)
	}
}

// ChangePassword 修改密码
func ChangePassword(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userID := GetUserID(c)
		if userID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type ChangePasswordRequest struct {
			OldPassword string `json:"oldPassword" validate:"required"`
			NewPassword string `json:"newPassword" validate:"required,min=8"`
		}

		var req ChangePasswordRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "密码格式不正确")
		}

		var user database.User
		if err := db.First(&user, userID).Error; err != nil {
			return ErrorResponse(c, http.StatusNotFound, "用户不存在")
		}

		// 验证旧密码
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword)); err != nil {
			return ErrorResponse(c, http.StatusUnauthorized, "原密码错误")
		}

		// 生成新密码哈希
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "密码加密失败")
		}

		// 更新密码
		if err := db.Model(&user).Update("password_hash", string(hashedPassword)).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "密码更新失败")
		}

		return SuccessResponse(c, nil)
	}
}

// getUserRoleInfo 获取用户角色信息
func getUserRoleInfo(db *gorm.DB, user *database.User) (*UserInfo, []AvailableRole, error) {
	userInfo := &UserInfo{
		ID:       user.ID,
		Username: user.Username,
		Role:     user.Role,
		Phone:    user.Phone,
		Avatar:   user.Avatar,
	}

	var availableRoles []AvailableRole

	switch user.Role {
	case "admin", "sub_admin":
		var admin database.Admin
		if err := db.Where("user_id = ?", user.ID).First(&admin).Error; err == nil {
			userInfo.RoleID = admin.ID
			userInfo.Name = admin.Name
			userInfo.Permissions = admin.Permissions
			availableRoles = append(availableRoles, AvailableRole{
				Role:   user.Role,
				RoleID: admin.ID,
				Name:   admin.Name,
			})
		}
	case "supplier":
		var supplier database.Supplier
		if err := db.Where("user_id = ?", user.ID).First(&supplier).Error; err == nil {
			userInfo.RoleID = supplier.ID
			userInfo.Name = supplier.Name
			availableRoles = append(availableRoles, AvailableRole{
				Role:   "supplier",
				RoleID: supplier.ID,
				Name:   supplier.Name,
			})
		}
	case "store":
		var store database.Store
		if err := db.Where("user_id = ?", user.ID).First(&store).Error; err == nil {
			userInfo.RoleID = store.ID
			userInfo.Name = store.Name
			availableRoles = append(availableRoles, AvailableRole{
				Role:   "store",
				RoleID: store.ID,
				Name:   store.Name,
			})
		}
	}

	// 如果只有一个角色，不返回availableRoles
	if len(availableRoles) == 1 {
		availableRoles = nil
	}

	return userInfo, availableRoles, nil
}

// generateSessionID 生成会话ID
func generateSessionID() string {
	// TODO: 实现会话ID生成逻辑
	return "session-" + time.Now().Format("20060102150405")
}

package types

import "time"

// UserRole 用户角色枚举
type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleSubAdmin UserRole = "sub_admin"
	RoleSupplier UserRole = "supplier"
	RoleStore    UserRole = "store"
)

// UserInfo 用户基础信息
type UserInfo struct {
	ID          uint64    `json:"id"`
	Username    string    `json:"username"`
	Role        UserRole  `json:"role"`
	Phone       string    `json:"phone,omitempty"`
	Email       string    `json:"email,omitempty"`
	Avatar      string    `json:"avatar,omitempty"`
	Status      int8      `json:"status"`
	LastLoginAt time.Time `json:"lastLoginAt,omitempty"`
}

// AdminInfo 管理员信息
type AdminInfo struct {
	ID          uint64   `json:"id"`
	UserID      uint64   `json:"userId"`
	Name        string   `json:"name"`
	IsPrimary   bool     `json:"isPrimary"`
	Permissions []string `json:"permissions"`
	Remark      string   `json:"remark,omitempty"`
	Status      int8     `json:"status"`
	User        UserInfo `json:"user,omitempty"`
}

// StoreInfo 门店信息
type StoreInfo struct {
	ID               uint64   `json:"id"`
	UserID           uint64   `json:"userId"`
	StoreNo          string   `json:"storeNo"`
	Name             string   `json:"name"`
	Logo             string   `json:"logo,omitempty"`
	Province         string   `json:"province"`
	City             string   `json:"city"`
	District         string   `json:"district"`
	Address          string   `json:"address"`
	ContactName      string   `json:"contactName"`
	ContactPhone     string   `json:"contactPhone"`
	MarkupEnabled    bool     `json:"markupEnabled"`
	WechatWebhookURL string   `json:"wechatWebhookUrl,omitempty"`
	WebhookEnabled   bool     `json:"webhookEnabled"`
	Status           int8     `json:"status"`
	User             UserInfo `json:"user,omitempty"`
}

// SupplierInfo 供应商信息
type SupplierInfo struct {
	ID               uint64       `json:"id"`
	UserID           uint64       `json:"userId"`
	SupplierNo       string       `json:"supplierNo"`
	Name             string       `json:"name"`
	DisplayName      string       `json:"displayName"`
	Logo             string       `json:"logo,omitempty"`
	ContactName      string       `json:"contactName"`
	ContactPhone     string       `json:"contactPhone"`
	MinOrderAmount   float64      `json:"minOrderAmount"`
	DeliveryDays     []int        `json:"deliveryDays"`
	DeliveryMode     DeliveryMode `json:"deliveryMode"`
	ManagementMode   string       `json:"managementMode"`
	HasBackend       bool         `json:"hasBackend"`
	WechatWebhookURL string       `json:"wechatWebhookUrl,omitempty"`
	WebhookEnabled   bool         `json:"webhookEnabled"`
	MarkupEnabled    bool         `json:"markupEnabled"`
	Remark           string       `json:"remark,omitempty"`
	Status           int8         `json:"status"`
	User             UserInfo     `json:"user,omitempty"`
}

// DeliveryMode 配送模式
type DeliveryMode string

const (
	SelfDelivery    DeliveryMode = "self_delivery"
	ExpressDelivery DeliveryMode = "express_delivery"
)

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Password string `json:"password" validate:"required,min=6,max=50"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	AccessToken  string   `json:"accessToken"`
	RefreshToken string   `json:"refreshToken"`
	ExpiresIn    int64    `json:"expiresIn"`
	User         UserInfo `json:"user"`
}

// TokenPayload JWT载荷
type TokenPayload struct {
	UserID   uint64   `json:"userId"`
	Username string   `json:"username"`
	Role     UserRole `json:"role"`
	Exp      int64    `json:"exp"`
	Iat      int64    `json:"iat"`
}

// RefreshTokenRequest 刷新Token请求
type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" validate:"required,min=6"`
	NewPassword string `json:"newPassword" validate:"required,min=6,max=50"`
}

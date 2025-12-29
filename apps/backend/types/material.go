package types

import "time"

// StockStatus 库存状态枚举
type StockStatus string

const (
	StockInStock    StockStatus = "in_stock"
	StockOutOfStock StockStatus = "out_of_stock"
)

// AuditStatus 审核状态枚举
type AuditStatus string

const (
	AuditPending  AuditStatus = "pending"
	AuditApproved AuditStatus = "approved"
	AuditRejected AuditStatus = "rejected"
)

// CategoryInfo 分类信息
type CategoryInfo struct {
	ID            uint64          `json:"id"`
	Name          string          `json:"name"`
	Icon          string          `json:"icon,omitempty"`
	SortOrder     int             `json:"sortOrder"`
	ParentID      *uint64         `json:"parentId,omitempty"`
	Level         int8            `json:"level"`
	Path          string          `json:"path"`
	MarkupEnabled bool            `json:"markupEnabled"`
	Status        int8            `json:"status"`
	Children      []*CategoryInfo `json:"children,omitempty"`
}

// MaterialInfo 物料基础信息
type MaterialInfo struct {
	ID          uint64        `json:"id"`
	MaterialNo  string        `json:"materialNo"`
	CategoryID  uint64        `json:"categoryId"`
	Name        string        `json:"name"`
	Alias       string        `json:"alias,omitempty"`
	Description string        `json:"description,omitempty"`
	ImageURL    string        `json:"imageUrl,omitempty"`
	Keywords    string        `json:"keywords,omitempty"`
	SortOrder   int           `json:"sortOrder"`
	Status      int8          `json:"status"`
	Category    *CategoryInfo `json:"category,omitempty"`
	Skus        []MaterialSku `json:"skus,omitempty"`
}

// MaterialSku 物料SKU
type MaterialSku struct {
	ID         uint64  `json:"id"`
	SkuNo      string  `json:"skuNo"`
	MaterialID uint64  `json:"materialId"`
	Brand      string  `json:"brand"`
	Spec       string  `json:"spec"`
	Unit       string  `json:"unit"`
	Weight     float64 `json:"weight,omitempty"`
	Barcode    string  `json:"barcode,omitempty"`
	ImageURL   string  `json:"imageUrl,omitempty"`
	Status     int8    `json:"status"`
}

// SupplierMaterialInfo 供应商物料报价信息
type SupplierMaterialInfo struct {
	ID            uint64       `json:"id"`
	SupplierID    uint64       `json:"supplierId"`
	MaterialSkuID uint64       `json:"materialSkuId"`
	Price         float64      `json:"price"`
	OriginalPrice float64      `json:"originalPrice,omitempty"`
	MinQuantity   int          `json:"minQuantity"`
	StepQuantity  int          `json:"stepQuantity"`
	StockStatus   StockStatus  `json:"stockStatus"`
	AuditStatus   AuditStatus  `json:"auditStatus"`
	RejectReason  string       `json:"rejectReason,omitempty"`
	IsRecommended bool         `json:"isRecommended"`
	SalesCount    int          `json:"salesCount"`
	Status        int8         `json:"status"`
	CreatedAt     time.Time    `json:"createdAt"`
	UpdatedAt     time.Time    `json:"updatedAt"`
	Sku           *MaterialSku `json:"sku,omitempty"`
}

// CreateCategoryRequest 创建分类请求
type CreateCategoryRequest struct {
	Name          string  `json:"name" validate:"required,max=50"`
	Icon          string  `json:"icon"`
	SortOrder     int     `json:"sortOrder"`
	ParentID      *uint64 `json:"parentId"`
	MarkupEnabled bool    `json:"markupEnabled"`
}

// UpdateCategoryRequest 更新分类请求
type UpdateCategoryRequest struct {
	Name          string `json:"name" validate:"max=50"`
	Icon          string `json:"icon"`
	SortOrder     int    `json:"sortOrder"`
	MarkupEnabled *bool  `json:"markupEnabled"`
}

// CreateMaterialRequest 创建物料请求
type CreateMaterialRequest struct {
	CategoryID  uint64 `json:"categoryId" validate:"required"`
	Name        string `json:"name" validate:"required,max=100"`
	Alias       string `json:"alias" validate:"max=100"`
	Description string `json:"description"`
	ImageURL    string `json:"imageUrl"`
	Keywords    string `json:"keywords" validate:"max=200"`
	SortOrder   int    `json:"sortOrder"`
}

// CreateMaterialSkuRequest 创建物料SKU请求
type CreateMaterialSkuRequest struct {
	MaterialID uint64  `json:"materialId" validate:"required"`
	Brand      string  `json:"brand" validate:"required,max=50"`
	Spec       string  `json:"spec" validate:"required,max=100"`
	Unit       string  `json:"unit" validate:"required,max=20"`
	Weight     float64 `json:"weight"`
	Barcode    string  `json:"barcode" validate:"max=50"`
	ImageURL   string  `json:"imageUrl"`
}

// CreateSupplierMaterialRequest 创建供应商物料报价请求
type CreateSupplierMaterialRequest struct {
	MaterialSkuID uint64  `json:"materialSkuId" validate:"required"`
	Price         float64 `json:"price" validate:"required,gt=0"`
	OriginalPrice float64 `json:"originalPrice"`
	MinQuantity   int     `json:"minQuantity" validate:"min=1"`
	StepQuantity  int     `json:"stepQuantity" validate:"min=1"`
}

// UpdateSupplierMaterialRequest 更新供应商物料报价请求
type UpdateSupplierMaterialRequest struct {
	Price         float64      `json:"price" validate:"gt=0"`
	OriginalPrice float64      `json:"originalPrice"`
	MinQuantity   int          `json:"minQuantity" validate:"min=1"`
	StepQuantity  int          `json:"stepQuantity" validate:"min=1"`
	StockStatus   *StockStatus `json:"stockStatus"`
}

// MaterialQueryParams 物料查询参数
type MaterialQueryParams struct {
	PaginationQuery
	CategoryID uint64 `json:"categoryId" query:"categoryId"`
	Keyword    string `json:"keyword" query:"keyword"`
	Brand      string `json:"brand" query:"brand"`
}

// SupplierMaterialQueryParams 供应商物料查询参数
type SupplierMaterialQueryParams struct {
	PaginationQuery
	SupplierID  uint64 `json:"supplierId" query:"supplierId"`
	CategoryID  uint64 `json:"categoryId" query:"categoryId"`
	Keyword     string `json:"keyword" query:"keyword"`
	StockStatus string `json:"stockStatus" query:"stockStatus"`
	AuditStatus string `json:"auditStatus" query:"auditStatus"`
}

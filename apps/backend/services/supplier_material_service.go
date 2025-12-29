package services

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// SupplierMaterialService 供应商物料服务
type SupplierMaterialService struct {
	db *gorm.DB
}

// NewSupplierMaterialService 创建供应商物料服务
func NewSupplierMaterialService(db *gorm.DB) *SupplierMaterialService {
	return &SupplierMaterialService{db: db}
}

// StockStatus 库存状态
type StockStatus string

const (
	StockStatusInStock    StockStatus = "in_stock"
	StockStatusOutOfStock StockStatus = "out_of_stock"
)

// SupplierMaterial 供应商物料模型
type SupplierMaterial struct {
	ID            uint64      `gorm:"primaryKey" json:"id"`
	SupplierID    uint64      `gorm:"not null;index" json:"supplierId"`
	MaterialSkuID uint64      `gorm:"not null;index" json:"materialSkuId"`
	Price         float64     `gorm:"type:decimal(10,2);not null" json:"price"`
	MinQuantity   int         `gorm:"default:1" json:"minQuantity"`
	StepQuantity  int         `gorm:"default:1" json:"stepQuantity"`
	StockStatus   StockStatus `gorm:"type:varchar(20);default:in_stock" json:"stockStatus"`
	Status        string      `gorm:"type:varchar(20);default:pending" json:"status"`
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
}

// TableName 表名
func (SupplierMaterial) TableName() string {
	return "supplier_materials"
}

// SupplierMaterialInfo 供应商物料信息（包含物料详情）
type SupplierMaterialInfo struct {
	ID            uint64      `json:"id"`
	MaterialSkuID uint64      `json:"materialSkuId"`
	MaterialName  string      `json:"materialName"`
	Brand         string      `json:"brand"`
	Spec          string      `json:"spec"`
	Unit          string      `json:"unit"`
	CategoryID    uint64      `json:"categoryId"`
	CategoryName  string      `json:"categoryName"`
	ImageURL      string      `json:"imageUrl"`
	Price         float64     `json:"price"`
	MinQuantity   int         `json:"minQuantity"`
	StepQuantity  int         `json:"stepQuantity"`
	StockStatus   StockStatus `json:"stockStatus"`
	Status        string      `json:"status"`
	UpdatedAt     time.Time   `json:"updatedAt"`
}

// SupplierMaterialQueryParams 查询参数
type SupplierMaterialQueryParams struct {
	Page        int         `query:"page"`
	PageSize    int         `query:"pageSize"`
	CategoryID  *uint64     `query:"categoryId"`
	StockStatus StockStatus `query:"stockStatus"`
	Keyword     string      `query:"keyword"`
}

// UpdatePriceRequest 更新价格请求
type UpdatePriceRequest struct {
	Price        float64 `json:"price" validate:"required,gt=0"`
	MinQuantity  int     `json:"minQuantity" validate:"gte=1"`
	StepQuantity int     `json:"stepQuantity" validate:"gte=1"`
}

// BatchUpdatePriceRequest 批量更新价格请求
type BatchUpdatePriceRequest struct {
	MaterialSkuIDs []uint64 `json:"materialSkuIds" validate:"required,min=1"`
	AdjustType     string   `json:"adjustType" validate:"required,oneof=fixed percent"`
	AdjustValue    float64  `json:"adjustValue" validate:"required"`
}

// BatchUpdateStockRequest 批量更新库存请求
type BatchUpdateStockRequest struct {
	MaterialSkuIDs []uint64    `json:"materialSkuIds" validate:"required,min=1"`
	StockStatus    StockStatus `json:"stockStatus" validate:"required,oneof=in_stock out_of_stock"`
}

// List 获取供应商物料列表
func (s *SupplierMaterialService) List(supplierID uint64, params *SupplierMaterialQueryParams) ([]SupplierMaterialInfo, int64, error) {
	var results []SupplierMaterialInfo
	var total int64

	query := s.db.Table("supplier_materials sm").
		Select(`
			sm.id,
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			ms.unit,
			ms.category_id,
			c.name as category_name,
			ms.image_url,
			sm.price,
			sm.min_quantity,
			sm.step_quantity,
			sm.stock_status,
			sm.status,
			sm.updated_at
		`).
		Joins("JOIN material_skus ms ON ms.id = sm.material_sku_id").
		Joins("LEFT JOIN categories c ON c.id = ms.category_id").
		Where("sm.supplier_id = ?", supplierID).
		Where("sm.status = ?", "approved")

	if params.CategoryID != nil {
		query = query.Where("ms.category_id = ?", *params.CategoryID)
	}
	if params.StockStatus != "" {
		query = query.Where("sm.stock_status = ?", params.StockStatus)
	}
	if params.Keyword != "" {
		query = query.Where("ms.name LIKE ?", "%"+params.Keyword+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	if err := query.Order("sm.updated_at DESC").Offset(offset).Limit(pageSize).Scan(&results).Error; err != nil {
		return nil, 0, err
	}

	return results, total, nil
}

// UpdatePrice 更新物料价格
func (s *SupplierMaterialService) UpdatePrice(supplierID uint64, materialSkuID uint64, req *UpdatePriceRequest) error {
	result := s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND material_sku_id = ?", supplierID, materialSkuID).
		Updates(map[string]interface{}{
			"price":         req.Price,
			"min_quantity":  req.MinQuantity,
			"step_quantity": req.StepQuantity,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("物料不存在")
	}
	return nil
}

// BatchUpdatePrice 批量更新价格
func (s *SupplierMaterialService) BatchUpdatePrice(supplierID uint64, req *BatchUpdatePriceRequest) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, skuID := range req.MaterialSkuIDs {
			var current SupplierMaterial
			if err := tx.Where("supplier_id = ? AND material_sku_id = ?", supplierID, skuID).First(&current).Error; err != nil {
				continue
			}

			var newPrice float64
			if req.AdjustType == "fixed" {
				newPrice = current.Price + req.AdjustValue
			} else {
				newPrice = current.Price * (1 + req.AdjustValue/100)
			}

			if newPrice < 0 {
				newPrice = 0
			}

			if err := tx.Model(&current).Update("price", newPrice).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// UpdateStockStatus 更新库存状态
func (s *SupplierMaterialService) UpdateStockStatus(supplierID uint64, materialSkuID uint64, status StockStatus) error {
	result := s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND material_sku_id = ?", supplierID, materialSkuID).
		Update("stock_status", status)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("物料不存在")
	}
	return nil
}

// BatchUpdateStockStatus 批量更新库存状态
func (s *SupplierMaterialService) BatchUpdateStockStatus(supplierID uint64, req *BatchUpdateStockRequest) error {
	return s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND material_sku_id IN ?", supplierID, req.MaterialSkuIDs).
		Update("stock_status", req.StockStatus).Error
}

// GetCategories 获取供应商的物料分类
func (s *SupplierMaterialService) GetCategories(supplierID uint64) ([]map[string]interface{}, error) {
	var categories []map[string]interface{}

	err := s.db.Table("supplier_materials sm").
		Select("DISTINCT c.id, c.name, COUNT(sm.id) as material_count").
		Joins("JOIN material_skus ms ON ms.id = sm.material_sku_id").
		Joins("JOIN categories c ON c.id = ms.category_id").
		Where("sm.supplier_id = ? AND sm.status = ?", supplierID, "approved").
		Group("c.id, c.name").
		Scan(&categories).Error

	return categories, err
}

// GetStockStats 获取库存统计
func (s *SupplierMaterialService) GetStockStats(supplierID uint64) (map[string]interface{}, error) {
	var total, inStock, outOfStock int64

	s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND status = ?", supplierID, "approved").
		Count(&total)

	s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND status = ? AND stock_status = ?", supplierID, "approved", StockStatusInStock).
		Count(&inStock)

	s.db.Model(&SupplierMaterial{}).
		Where("supplier_id = ? AND status = ? AND stock_status = ?", supplierID, "approved", StockStatusOutOfStock).
		Count(&outOfStock)

	return map[string]interface{}{
		"total":      total,
		"inStock":    inStock,
		"outOfStock": outOfStock,
	}, nil
}

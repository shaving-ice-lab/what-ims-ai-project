package services

import (
	"time"

	"gorm.io/gorm"
)

// AssetService 素材库服务
type AssetService struct {
	db *gorm.DB
}

// NewAssetService 创建素材库服务
func NewAssetService(db *gorm.DB) *AssetService {
	return &AssetService{db: db}
}

// ImageAsset 图片素材
type ImageAsset struct {
	ID          uint64    `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(200);not null" json:"name"`
	URL         string    `gorm:"type:varchar(500);not null" json:"url"`
	CategoryID  *uint64   `json:"categoryId"`
	Brand       string    `gorm:"type:varchar(100)" json:"brand"`
	Tags        string    `gorm:"type:varchar(500)" json:"tags"` // 逗号分隔
	SkuCode     string    `gorm:"type:varchar(50)" json:"skuCode"`
	Width       int       `json:"width"`
	Height      int       `json:"height"`
	FileSize    int64     `json:"fileSize"`
	UseCount    int64     `json:"useCount"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// TableName 表名
func (ImageAsset) TableName() string {
	return "image_assets"
}

// ImageMatchConfig 图片匹配配置
type ImageMatchConfig struct {
	AutoMatchEnabled    bool    `json:"autoMatchEnabled"`
	NameSimilarityThreshold float64 `json:"nameSimilarityThreshold"` // 默认0.8
	BrandExactMatch     bool    `json:"brandExactMatch"`
	SpecExactMatch      bool    `json:"specExactMatch"`
	SkuExactMatch       bool    `json:"skuExactMatch"`
}

// AssetQueryParams 素材查询参数
type AssetQueryParams struct {
	Page       int     `query:"page"`
	PageSize   int     `query:"pageSize"`
	CategoryID *uint64 `query:"categoryId"`
	Brand      string  `query:"brand"`
	Keyword    string  `query:"keyword"`
}

// ListAssets 获取素材列表
func (s *AssetService) ListAssets(params *AssetQueryParams) ([]ImageAsset, int64, error) {
	var assets []ImageAsset
	var total int64

	query := s.db.Model(&ImageAsset{})

	if params.CategoryID != nil {
		query = query.Where("category_id = ?", *params.CategoryID)
	}
	if params.Brand != "" {
		query = query.Where("brand = ?", params.Brand)
	}
	if params.Keyword != "" {
		query = query.Where("name LIKE ? OR tags LIKE ? OR sku_code LIKE ?",
			"%"+params.Keyword+"%", "%"+params.Keyword+"%", "%"+params.Keyword+"%")
	}

	query.Count(&total)

	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&assets).Error
	return assets, total, err
}

// CreateAsset 创建素材
func (s *AssetService) CreateAsset(asset *ImageAsset) error {
	asset.CreatedAt = time.Now()
	asset.UpdatedAt = time.Now()
	return s.db.Create(asset).Error
}

// BatchCreateAssets 批量创建素材
func (s *AssetService) BatchCreateAssets(assets []ImageAsset) error {
	now := time.Now()
	for i := range assets {
		assets[i].CreatedAt = now
		assets[i].UpdatedAt = now
	}
	return s.db.Create(&assets).Error
}

// UpdateAsset 更新素材
func (s *AssetService) UpdateAsset(id uint64, name, brand, tags string, categoryID *uint64) error {
	return s.db.Model(&ImageAsset{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"name":        name,
			"brand":       brand,
			"tags":        tags,
			"category_id": categoryID,
			"updated_at":  time.Now(),
		}).Error
}

// DeleteAsset 删除素材
func (s *AssetService) DeleteAsset(id uint64) error {
	// 检查是否有关联产品
	var count int64
	s.db.Table("material_skus").Where("image_asset_id = ?", id).Count(&count)
	if count > 0 {
		// 先解除关联再删除
		s.db.Table("material_skus").Where("image_asset_id = ?", id).Update("image_asset_id", nil)
	}
	return s.db.Delete(&ImageAsset{}, id).Error
}

// GetAssetUsageStats 获取素材使用统计
func (s *AssetService) GetAssetUsageStats(id uint64) (map[string]interface{}, error) {
	var asset ImageAsset
	if err := s.db.First(&asset, id).Error; err != nil {
		return nil, err
	}

	// 获取关联的产品
	var products []map[string]interface{}
	s.db.Table("material_skus").
		Select("id, name, brand, spec").
		Where("image_asset_id = ?", id).
		Scan(&products)

	return map[string]interface{}{
		"asset":        asset,
		"useCount":     len(products),
		"products":     products,
	}, nil
}

// MatchImageForProduct 为产品匹配图片
func (s *AssetService) MatchImageForProduct(productName, brand, spec, skuCode string) (*ImageAsset, float64, error) {
	var asset ImageAsset
	var confidence float64 = 0

	// 1. SKU精确匹配（最高优先级）
	if skuCode != "" {
		err := s.db.Where("sku_code = ?", skuCode).First(&asset).Error
		if err == nil {
			return &asset, 1.0, nil
		}
	}

	// 2. 品牌+名称匹配
	if brand != "" {
		err := s.db.Where("brand = ? AND name LIKE ?", brand, "%"+productName+"%").First(&asset).Error
		if err == nil {
			return &asset, 0.9, nil
		}
	}

	// 3. 名称模糊匹配
	err := s.db.Where("name LIKE ?", "%"+productName+"%").First(&asset).Error
	if err == nil {
		return &asset, 0.7, nil
	}

	return nil, 0, nil
}

// BatchMatchImages 批量匹配图片
func (s *AssetService) BatchMatchImages(materialSkuIDs []uint64) ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	for _, skuID := range materialSkuIDs {
		var sku struct {
			ID      uint64
			Name    string
			Brand   string
			Spec    string
			SkuCode string
		}
		s.db.Table("material_skus").Select("id, name, brand, spec, sku_code").Where("id = ?", skuID).First(&sku)

		asset, confidence, _ := s.MatchImageForProduct(sku.Name, sku.Brand, sku.Spec, sku.SkuCode)

		result := map[string]interface{}{
			"materialSkuId": skuID,
			"materialName":  sku.Name,
			"matched":       asset != nil,
			"confidence":    confidence,
		}
		if asset != nil {
			result["assetId"] = asset.ID
			result["assetUrl"] = asset.URL
		}
		results = append(results, result)
	}

	return results, nil
}

// ApplyImageMatch 应用图片匹配结果
func (s *AssetService) ApplyImageMatch(materialSkuID, assetID uint64) error {
	// 更新素材使用次数
	s.db.Model(&ImageAsset{}).Where("id = ?", assetID).UpdateColumn("use_count", gorm.Expr("use_count + 1"))

	// 关联到产品
	return s.db.Table("material_skus").Where("id = ?", materialSkuID).Update("image_asset_id", assetID).Error
}

// GetMatchConfig 获取匹配配置
func (s *AssetService) GetMatchConfig() (*ImageMatchConfig, error) {
	config := &ImageMatchConfig{
		AutoMatchEnabled:        true,
		NameSimilarityThreshold: 0.8,
		BrandExactMatch:         true,
		SpecExactMatch:          false,
		SkuExactMatch:           true,
	}
	// TODO: 从system_configs表读取配置
	return config, nil
}

// SaveMatchConfig 保存匹配配置
func (s *AssetService) SaveMatchConfig(config *ImageMatchConfig) error {
	// TODO: 保存到system_configs表
	return nil
}

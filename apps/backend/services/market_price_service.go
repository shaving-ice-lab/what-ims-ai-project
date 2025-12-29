package services

import (
	"gorm.io/gorm"
)

// MarketPriceService 市场行情服务
type MarketPriceService struct {
	db *gorm.DB
}

// NewMarketPriceService 创建市场行情服务
func NewMarketPriceService(db *gorm.DB) *MarketPriceService {
	return &MarketPriceService{db: db}
}

// PriceStatus 价格状态
type PriceStatus string

const (
	PriceStatusLowest  PriceStatus = "lowest"  // 最低价
	PriceStatusHigher  PriceStatus = "higher"  // 偏高
	PriceStatusNormal  PriceStatus = "normal"  // 持平
)

// MarketPriceOverview 市场价格概览
type MarketPriceOverview struct {
	TotalProducts      int     `json:"totalProducts"`      // 在售产品总数
	LowestPriceCount   int     `json:"lowestPriceCount"`   // 价格最低产品数量
	HigherPriceCount   int     `json:"higherPriceCount"`   // 价格偏高产品数量
	NormalPriceCount   int     `json:"normalPriceCount"`   // 价格持平产品数量
	AveragePriceAdvantage float64 `json:"averagePriceAdvantage"` // 平均价格优势率
}

// ProductPriceComparison 产品价格对比
type ProductPriceComparison struct {
	MaterialSkuID   uint64      `json:"materialSkuId"`
	MaterialName    string      `json:"materialName"`
	Brand           string      `json:"brand"`
	Spec            string      `json:"spec"`
	Unit            string      `json:"unit"`
	CategoryID      uint64      `json:"categoryId"`
	CategoryName    string      `json:"categoryName"`
	SupplierPrice   float64     `json:"supplierPrice"`   // 供应商报价
	MarketLowestPrice float64   `json:"marketLowestPrice"` // 市场最低价
	PriceDiff       float64     `json:"priceDiff"`       // 价差
	PriceStatus     PriceStatus `json:"priceStatus"`     // 价格状态
	CompetitorCount int         `json:"competitorCount"` // 竞争对手数量
}

// PriceComparisonQueryParams 价格对比查询参数
type PriceComparisonQueryParams struct {
	Page        int         `query:"page"`
	PageSize    int         `query:"pageSize"`
	CategoryID  *uint64     `query:"categoryId"`
	PriceStatus PriceStatus `query:"priceStatus"`
	Keyword     string      `query:"keyword"`
}

// PriceAdjustmentSuggestion 价格调整建议
type PriceAdjustmentSuggestion struct {
	MaterialSkuID     uint64  `json:"materialSkuId"`
	MaterialName      string  `json:"materialName"`
	CurrentPrice      float64 `json:"currentPrice"`
	SuggestedPrice    float64 `json:"suggestedPrice"`
	MarketLowestPrice float64 `json:"marketLowestPrice"`
	PotentialOrders   int     `json:"potentialOrders"` // 潜在订单数
}

// GetMarketOverview 获取市场价格概览
func (s *MarketPriceService) GetMarketOverview(supplierID uint64) (*MarketPriceOverview, error) {
	// 查询供应商的所有在售产品
	var totalProducts int64
	s.db.Table("supplier_materials").
		Where("supplier_id = ? AND status = ?", supplierID, "on_sale").
		Count(&totalProducts)

	// 统计价格最低的产品数量
	var lowestCount int64
	s.db.Raw(`
		SELECT COUNT(*) FROM supplier_materials sm
		WHERE sm.supplier_id = ? AND sm.status = 'on_sale'
		AND sm.price = (
			SELECT MIN(price) FROM supplier_materials 
			WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale'
		)
	`, supplierID).Scan(&lowestCount)

	// 统计价格偏高的产品数量（比最低价高10%以上）
	var higherCount int64
	s.db.Raw(`
		SELECT COUNT(*) FROM supplier_materials sm
		WHERE sm.supplier_id = ? AND sm.status = 'on_sale'
		AND sm.price > (
			SELECT MIN(price) * 1.1 FROM supplier_materials 
			WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale'
		)
	`, supplierID).Scan(&higherCount)

	normalCount := int(totalProducts) - int(lowestCount) - int(higherCount)

	// 计算平均价格优势率
	var avgAdvantage float64
	if totalProducts > 0 {
		avgAdvantage = float64(lowestCount) / float64(totalProducts) * 100
	}

	return &MarketPriceOverview{
		TotalProducts:         int(totalProducts),
		LowestPriceCount:      int(lowestCount),
		HigherPriceCount:      int(higherCount),
		NormalPriceCount:      normalCount,
		AveragePriceAdvantage: avgAdvantage,
	}, nil
}

// GetPriceComparisons 获取产品价格对比列表
func (s *MarketPriceService) GetPriceComparisons(supplierID uint64, params *PriceComparisonQueryParams) ([]ProductPriceComparison, int64, error) {
	var results []ProductPriceComparison
	var total int64

	// 构建查询
	query := s.db.Table("supplier_materials sm").
		Select(`
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			ms.unit,
			ms.category_id,
			c.name as category_name,
			sm.price as supplier_price,
			(SELECT MIN(price) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale') as market_lowest_price,
			(SELECT COUNT(*) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale' AND supplier_id != ?) as competitor_count
		`, supplierID).
		Joins("JOIN material_skus ms ON ms.id = sm.material_sku_id").
		Joins("LEFT JOIN categories c ON c.id = ms.category_id").
		Where("sm.supplier_id = ? AND sm.status = ?", supplierID, "on_sale")

	if params.CategoryID != nil {
		query = query.Where("ms.category_id = ?", *params.CategoryID)
	}

	if params.Keyword != "" {
		query = query.Where("ms.name LIKE ?", "%"+params.Keyword+"%")
	}

	// 计数
	query.Count(&total)

	// 分页
	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	if err := query.Offset(offset).Limit(pageSize).Scan(&results).Error; err != nil {
		return nil, 0, err
	}

	// 计算价差和价格状态
	for i := range results {
		results[i].PriceDiff = results[i].SupplierPrice - results[i].MarketLowestPrice
		
		if results[i].SupplierPrice <= results[i].MarketLowestPrice {
			results[i].PriceStatus = PriceStatusLowest
		} else if results[i].SupplierPrice > results[i].MarketLowestPrice*1.1 {
			results[i].PriceStatus = PriceStatusHigher
		} else {
			results[i].PriceStatus = PriceStatusNormal
		}
	}

	// 按价格状态筛选
	if params.PriceStatus != "" {
		filtered := make([]ProductPriceComparison, 0)
		for _, r := range results {
			if r.PriceStatus == params.PriceStatus {
				filtered = append(filtered, r)
			}
		}
		results = filtered
	}

	return results, total, nil
}

// GetPriceAdjustmentSuggestions 获取价格调整建议
func (s *MarketPriceService) GetPriceAdjustmentSuggestions(supplierID uint64) ([]PriceAdjustmentSuggestion, error) {
	var suggestions []PriceAdjustmentSuggestion

	// 查询价格偏高的产品并生成建议
	s.db.Raw(`
		SELECT 
			sm.material_sku_id,
			ms.name as material_name,
			sm.price as current_price,
			(SELECT MIN(price) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale') as market_lowest_price,
			(SELECT MIN(price) * 1.05 FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale') as suggested_price
		FROM supplier_materials sm
		JOIN material_skus ms ON ms.id = sm.material_sku_id
		WHERE sm.supplier_id = ? AND sm.status = 'on_sale'
		AND sm.price > (
			SELECT MIN(price) * 1.1 FROM supplier_materials 
			WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale'
		)
		ORDER BY (sm.price - (SELECT MIN(price) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale')) DESC
		LIMIT 10
	`, supplierID).Scan(&suggestions)

	return suggestions, nil
}

// GetLowestPriceProducts 获取价格优势产品列表
func (s *MarketPriceService) GetLowestPriceProducts(supplierID uint64, limit int) ([]ProductPriceComparison, error) {
	var results []ProductPriceComparison

	if limit <= 0 {
		limit = 10
	}

	s.db.Raw(`
		SELECT 
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			ms.unit,
			sm.price as supplier_price,
			(SELECT MIN(price) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale') as market_lowest_price,
			(SELECT COUNT(*) FROM supplier_materials WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale' AND supplier_id != ?) as competitor_count
		FROM supplier_materials sm
		JOIN material_skus ms ON ms.id = sm.material_sku_id
		WHERE sm.supplier_id = ? AND sm.status = 'on_sale'
		AND sm.price = (
			SELECT MIN(price) FROM supplier_materials 
			WHERE material_sku_id = sm.material_sku_id AND status = 'on_sale'
		)
		LIMIT ?
	`, supplierID, supplierID, limit).Scan(&results)

	for i := range results {
		results[i].PriceStatus = PriceStatusLowest
		results[i].PriceDiff = 0
	}

	return results, nil
}

package services

import (
	"gorm.io/gorm"
)

// AdminMarketService 管理员市场行情服务
type AdminMarketService struct {
	db *gorm.DB
}

// NewAdminMarketService 创建管理员市场行情服务
func NewAdminMarketService(db *gorm.DB) *AdminMarketService {
	return &AdminMarketService{db: db}
}

// MarketDashboardStats 市场行情仪表盘统计
type MarketDashboardStats struct {
	TotalProducts     int     `json:"totalProducts"`
	ActiveSuppliers   int     `json:"activeSuppliers"`
	PriceAnomalyCount int     `json:"priceAnomalyCount"`
	ExclusiveProducts int     `json:"exclusiveProducts"`
	AverageMarkupRate float64 `json:"averageMarkupRate"`
	TodayPriceChanges int     `json:"todayPriceChanges"`
	NewProductsToday  int     `json:"newProductsToday"`
}

// PriceComparisonDetail 价格对比详情
type PriceComparisonDetail struct {
	MaterialSkuID   uint64                `json:"materialSkuId"`
	MaterialName    string                `json:"materialName"`
	Brand           string                `json:"brand"`
	Spec            string                `json:"spec"`
	CategoryName    string                `json:"categoryName"`
	SupplierCount   int                   `json:"supplierCount"`
	MinPrice        float64               `json:"minPrice"`
	MaxPrice        float64               `json:"maxPrice"`
	PriceDiffRate   float64               `json:"priceDiffRate"`
	AvgMarkupRate   float64               `json:"avgMarkupRate"`
	IsExclusive     bool                  `json:"isExclusive"`
	IsPriceAnomaly  bool                  `json:"isPriceAnomaly"`
	SupplierDetails []SupplierPriceDetail `json:"supplierDetails,omitempty"`
}

// SupplierPriceDetail 供应商价格详情
type SupplierPriceDetail struct {
	SupplierID    uint64   `json:"supplierId"`
	SupplierName  string   `json:"supplierName"`
	OriginalPrice float64  `json:"originalPrice"`
	MarkupAmount  float64  `json:"markupAmount"`
	FinalPrice    float64  `json:"finalPrice"`
	DeliveryAreas []string `json:"deliveryAreas"`
	IsLowest      bool     `json:"isLowest"`
}

// PriceAnomaly 价格异常预警
type PriceAnomaly struct {
	MaterialSkuID uint64  `json:"materialSkuId"`
	MaterialName  string  `json:"materialName"`
	Brand         string  `json:"brand"`
	PriceDiffRate float64 `json:"priceDiffRate"`
	SupplierCount int     `json:"supplierCount"`
	Suggestion    string  `json:"suggestion"`
}

// ExclusiveProduct 独家供应产品
type ExclusiveProduct struct {
	MaterialSkuID uint64  `json:"materialSkuId"`
	MaterialName  string  `json:"materialName"`
	Brand         string  `json:"brand"`
	SupplierID    uint64  `json:"supplierId"`
	SupplierName  string  `json:"supplierName"`
	Price         float64 `json:"price"`
	RiskLevel     string  `json:"riskLevel"`
}

// MarketQueryParams 市场行情查询参数
type MarketQueryParams struct {
	Page       int     `query:"page"`
	PageSize   int     `query:"pageSize"`
	Province   string  `query:"province"`
	City       string  `query:"city"`
	CategoryID *uint64 `query:"categoryId"`
	Keyword    string  `query:"keyword"`
}

// GetMarketDashboardStats 获取市场行情仪表盘统计
func (s *AdminMarketService) GetMarketDashboardStats() (*MarketDashboardStats, error) {
	stats := &MarketDashboardStats{}

	// 在售产品总数
	s.db.Table("supplier_materials").
		Where("status = ?", "approved").
		Select("COUNT(DISTINCT material_sku_id)").
		Scan(&stats.TotalProducts)

	// 活跃供应商数量
	var activeSuppliers int64
	s.db.Table("suppliers").
		Where("status = ?", "enabled").
		Count(&activeSuppliers)
	stats.ActiveSuppliers = int(activeSuppliers)

	// 价格异常数量（价差超过15%）
	s.db.Raw(`
		SELECT COUNT(*) FROM (
			SELECT material_sku_id,
				(MAX(price) - MIN(price)) / MIN(price) * 100 as diff_rate
			FROM supplier_materials
			WHERE status = 'approved'
			GROUP BY material_sku_id
			HAVING diff_rate > 15
		) t
	`).Scan(&stats.PriceAnomalyCount)

	// 独家供应产品数量
	s.db.Raw(`
		SELECT COUNT(*) FROM (
			SELECT material_sku_id
			FROM supplier_materials
			WHERE status = 'approved'
			GROUP BY material_sku_id
			HAVING COUNT(DISTINCT supplier_id) = 1
		) t
	`).Scan(&stats.ExclusiveProducts)

	// 平均加价率
	s.db.Table("price_markups").
		Where("is_active = ?", true).
		Select("COALESCE(AVG(markup_value), 0)").
		Scan(&stats.AverageMarkupRate)

	return stats, nil
}

// GetPriceComparisons 获取产品价格对比列表
func (s *AdminMarketService) GetPriceComparisons(params *MarketQueryParams) ([]PriceComparisonDetail, int64, error) {
	var results []PriceComparisonDetail
	var total int64

	query := s.db.Table("material_skus ms").
		Select(`
			ms.id as material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			c.name as category_name,
			(SELECT COUNT(DISTINCT supplier_id) FROM supplier_materials WHERE material_sku_id = ms.id AND status = 'approved') as supplier_count,
			(SELECT MIN(price) FROM supplier_materials WHERE material_sku_id = ms.id AND status = 'approved') as min_price,
			(SELECT MAX(price) FROM supplier_materials WHERE material_sku_id = ms.id AND status = 'approved') as max_price
		`).
		Joins("LEFT JOIN categories c ON c.id = ms.category_id").
		Where("ms.status = ?", "enabled")

	if params.CategoryID != nil {
		query = query.Where("ms.category_id = ?", *params.CategoryID)
	}
	if params.Keyword != "" {
		query = query.Where("ms.name LIKE ?", "%"+params.Keyword+"%")
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

	if err := query.Offset(offset).Limit(pageSize).Scan(&results).Error; err != nil {
		return nil, 0, err
	}

	// 计算价差率和标记
	for i := range results {
		if results[i].MinPrice > 0 {
			results[i].PriceDiffRate = (results[i].MaxPrice - results[i].MinPrice) / results[i].MinPrice * 100
		}
		results[i].IsExclusive = results[i].SupplierCount == 1
		results[i].IsPriceAnomaly = results[i].PriceDiffRate > 15
	}

	return results, total, nil
}

// GetPriceAnomalies 获取价格异常预警列表
func (s *AdminMarketService) GetPriceAnomalies(limit int) ([]PriceAnomaly, error) {
	if limit <= 0 {
		limit = 20
	}

	var anomalies []PriceAnomaly

	s.db.Raw(`
		SELECT
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			(MAX(sm.price) - MIN(sm.price)) / MIN(sm.price) * 100 as price_diff_rate,
			COUNT(DISTINCT sm.supplier_id) as supplier_count
		FROM supplier_materials sm
		JOIN material_skus ms ON ms.id = sm.material_sku_id
		WHERE sm.status = 'approved'
		GROUP BY sm.material_sku_id, ms.name, ms.brand
		HAVING price_diff_rate > 15
		ORDER BY price_diff_rate DESC
		LIMIT ?
	`, limit).Scan(&anomalies)

	// 添加建议
	for i := range anomalies {
		if anomalies[i].PriceDiffRate > 30 {
			anomalies[i].Suggestion = "建议联系供应商核实价格，价差过大"
		} else {
			anomalies[i].Suggestion = "建议关注价格走势"
		}
	}

	return anomalies, nil
}

// GetExclusiveProducts 获取独家供应产品列表
func (s *AdminMarketService) GetExclusiveProducts(limit int) ([]ExclusiveProduct, error) {
	if limit <= 0 {
		limit = 20
	}

	var products []ExclusiveProduct

	s.db.Raw(`
		SELECT
			sm.material_sku_id,
			ms.name as material_name,
			ms.brand,
			sm.supplier_id,
			s.name as supplier_name,
			sm.price
		FROM supplier_materials sm
		JOIN material_skus ms ON ms.id = sm.material_sku_id
		JOIN suppliers s ON s.id = sm.supplier_id
		WHERE sm.status = 'approved'
		AND sm.material_sku_id IN (
			SELECT material_sku_id
			FROM supplier_materials
			WHERE status = 'approved'
			GROUP BY material_sku_id
			HAVING COUNT(DISTINCT supplier_id) = 1
		)
		LIMIT ?
	`, limit).Scan(&products)

	// 添加风险等级
	for i := range products {
		products[i].RiskLevel = "medium" // 独家供应默认中等风险
	}

	return products, nil
}

// GetSupplierPriceDetails 获取指定产品的各供应商价格详情
func (s *AdminMarketService) GetSupplierPriceDetails(materialSkuID uint64) ([]SupplierPriceDetail, error) {
	var details []SupplierPriceDetail

	err := s.db.Table("supplier_materials sm").
		Select(`
			sm.supplier_id,
			s.name as supplier_name,
			sm.price as original_price,
			COALESCE(pm.markup_value, 0) as markup_amount,
			sm.price + COALESCE(pm.markup_value, 0) as final_price
		`).
		Joins("JOIN suppliers s ON s.id = sm.supplier_id").
		Joins("LEFT JOIN price_markups pm ON pm.supplier_id = sm.supplier_id AND pm.is_active = 1").
		Where("sm.material_sku_id = ? AND sm.status = ?", materialSkuID, "approved").
		Order("sm.price ASC").
		Scan(&details).Error

	if len(details) > 0 {
		details[0].IsLowest = true
	}

	return details, err
}

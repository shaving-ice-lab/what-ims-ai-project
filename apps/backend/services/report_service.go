package services

import (
	"time"

	"gorm.io/gorm"
)

// ReportService 报表服务
type ReportService struct {
	db *gorm.DB
}

// NewReportService 创建报表服务
func NewReportService(db *gorm.DB) *ReportService {
	return &ReportService{db: db}
}

// StoreReport 门店报表
type StoreReport struct {
	StoreID          uint64  `json:"storeId"`
	StoreName        string  `json:"storeName"`
	OrderAmount      float64 `json:"orderAmount"`
	OrderCount       int64   `json:"orderCount"`
	TopMaterials     string  `json:"topMaterials"`
	AvgOrderAmount   float64 `json:"avgOrderAmount"`
}

// SupplierReport 供应商报表
type SupplierReport struct {
	SupplierID       uint64  `json:"supplierId"`
	SupplierName     string  `json:"supplierName"`
	SalesAmount      float64 `json:"salesAmount"`
	OrderCount       int64   `json:"orderCount"`
	TopMaterials     string  `json:"topMaterials"`
	AvgOrderAmount   float64 `json:"avgOrderAmount"`
}

// MaterialReport 物料报表
type MaterialReport struct {
	MaterialSkuID    uint64  `json:"materialSkuId"`
	MaterialName     string  `json:"materialName"`
	Brand            string  `json:"brand"`
	Spec             string  `json:"spec"`
	CategoryName     string  `json:"categoryName"`
	TotalQuantity    int64   `json:"totalQuantity"`
	TotalAmount      float64 `json:"totalAmount"`
	StoreCount       int64   `json:"storeCount"`
}

// ComparisonData 对比数据
type ComparisonData struct {
	Period       string  `json:"period"`
	CurrentValue float64 `json:"currentValue"`
	PreviousValue float64 `json:"previousValue"`
	ChangeRate   float64 `json:"changeRate"`
}

// ReportQueryParams 报表查询参数
type ReportQueryParams struct {
	Page      int        `query:"page"`
	PageSize  int        `query:"pageSize"`
	StartDate *time.Time `query:"startDate"`
	EndDate   *time.Time `query:"endDate"`
	CategoryID *uint64   `query:"categoryId"`
}

// GetStoreReports 获取门店报表
func (s *ReportService) GetStoreReports(params *ReportQueryParams) ([]StoreReport, int64, error) {
	var reports []StoreReport
	var total int64

	query := s.db.Table("orders o").
		Select(`
			o.store_id,
			st.name as store_name,
			COALESCE(SUM(o.total_amount), 0) as order_amount,
			COUNT(*) as order_count,
			COALESCE(SUM(o.total_amount) / COUNT(*), 0) as avg_order_amount
		`).
		Joins("JOIN stores st ON st.id = o.store_id").
		Group("o.store_id, st.name")

	if params.StartDate != nil {
		query = query.Where("o.created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("o.created_at <= ?", params.EndDate)
	}

	// 计数
	countQuery := s.db.Table("stores")
	countQuery.Count(&total)

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

	err := query.Order("order_amount DESC").Offset(offset).Limit(pageSize).Scan(&reports).Error
	return reports, total, err
}

// GetStoreDetail 获取门店详情报表
func (s *ReportService) GetStoreDetail(storeID uint64, params *ReportQueryParams) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	// 基本统计
	var stats struct {
		OrderAmount float64
		OrderCount  int64
	}
	query := s.db.Table("orders").
		Select("COALESCE(SUM(total_amount), 0) as order_amount, COUNT(*) as order_count").
		Where("store_id = ?", storeID)

	if params.StartDate != nil {
		query = query.Where("created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("created_at <= ?", params.EndDate)
	}
	query.Scan(&stats)

	result["orderAmount"] = stats.OrderAmount
	result["orderCount"] = stats.OrderCount

	// 常购物料
	var topMaterials []map[string]interface{}
	s.db.Table("order_items oi").
		Select("ms.name as material_name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_amount").
		Joins("JOIN orders o ON o.id = oi.order_id").
		Joins("JOIN material_skus ms ON ms.id = oi.material_sku_id").
		Where("o.store_id = ?", storeID).
		Group("ms.name").
		Order("total_quantity DESC").
		Limit(10).
		Scan(&topMaterials)

	result["topMaterials"] = topMaterials

	return result, nil
}

// GetSupplierReports 获取供应商报表
func (s *ReportService) GetSupplierReports(params *ReportQueryParams) ([]SupplierReport, int64, error) {
	var reports []SupplierReport
	var total int64

	query := s.db.Table("orders o").
		Select(`
			o.supplier_id,
			sp.name as supplier_name,
			COALESCE(SUM(o.total_amount), 0) as sales_amount,
			COUNT(*) as order_count,
			COALESCE(SUM(o.total_amount) / COUNT(*), 0) as avg_order_amount
		`).
		Joins("JOIN suppliers sp ON sp.id = o.supplier_id").
		Group("o.supplier_id, sp.name")

	if params.StartDate != nil {
		query = query.Where("o.created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("o.created_at <= ?", params.EndDate)
	}

	// 计数
	countQuery := s.db.Table("suppliers")
	countQuery.Count(&total)

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

	err := query.Order("sales_amount DESC").Offset(offset).Limit(pageSize).Scan(&reports).Error
	return reports, total, err
}

// GetSupplierDetail 获取供应商详情报表
func (s *ReportService) GetSupplierDetail(supplierID uint64, params *ReportQueryParams) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	// 基本统计
	var stats struct {
		SalesAmount float64
		OrderCount  int64
	}
	query := s.db.Table("orders").
		Select("COALESCE(SUM(total_amount), 0) as sales_amount, COUNT(*) as order_count").
		Where("supplier_id = ?", supplierID)

	if params.StartDate != nil {
		query = query.Where("created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("created_at <= ?", params.EndDate)
	}
	query.Scan(&stats)

	result["salesAmount"] = stats.SalesAmount
	result["orderCount"] = stats.OrderCount

	// 热销物料
	var topMaterials []map[string]interface{}
	s.db.Table("order_items oi").
		Select("ms.name as material_name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_amount").
		Joins("JOIN orders o ON o.id = oi.order_id").
		Joins("JOIN material_skus ms ON ms.id = oi.material_sku_id").
		Where("o.supplier_id = ?", supplierID).
		Group("ms.name").
		Order("total_quantity DESC").
		Limit(10).
		Scan(&topMaterials)

	result["topMaterials"] = topMaterials

	return result, nil
}

// GetMaterialReports 获取物料报表
func (s *ReportService) GetMaterialReports(params *ReportQueryParams) ([]MaterialReport, int64, error) {
	var reports []MaterialReport
	var total int64

	query := s.db.Table("order_items oi").
		Select(`
			oi.material_sku_id,
			ms.name as material_name,
			ms.brand,
			ms.spec,
			c.name as category_name,
			COALESCE(SUM(oi.quantity), 0) as total_quantity,
			COALESCE(SUM(oi.quantity * oi.price), 0) as total_amount,
			COUNT(DISTINCT o.store_id) as store_count
		`).
		Joins("JOIN orders o ON o.id = oi.order_id").
		Joins("JOIN material_skus ms ON ms.id = oi.material_sku_id").
		Joins("LEFT JOIN categories c ON c.id = ms.category_id").
		Group("oi.material_sku_id, ms.name, ms.brand, ms.spec, c.name")

	if params.StartDate != nil {
		query = query.Where("o.created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("o.created_at <= ?", params.EndDate)
	}
	if params.CategoryID != nil {
		query = query.Where("ms.category_id = ?", *params.CategoryID)
	}

	// 计数
	s.db.Table("material_skus").Count(&total)

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

	err := query.Order("total_quantity DESC").Offset(offset).Limit(pageSize).Scan(&reports).Error
	return reports, total, err
}

// GetComparisonData 获取对比分析数据
func (s *ReportService) GetComparisonData(compareType string, currentStart, currentEnd, previousStart, previousEnd time.Time) (*ComparisonData, error) {
	var currentValue, previousValue float64

	// 当期数据
	s.db.Table("orders").
		Select("COALESCE(SUM(total_amount), 0)").
		Where("created_at >= ? AND created_at <= ?", currentStart, currentEnd).
		Scan(&currentValue)

	// 上期数据
	s.db.Table("orders").
		Select("COALESCE(SUM(total_amount), 0)").
		Where("created_at >= ? AND created_at <= ?", previousStart, previousEnd).
		Scan(&previousValue)

	changeRate := float64(0)
	if previousValue > 0 {
		changeRate = (currentValue - previousValue) / previousValue * 100
	}

	return &ComparisonData{
		Period:        compareType,
		CurrentValue:  currentValue,
		PreviousValue: previousValue,
		ChangeRate:    changeRate,
	}, nil
}

// GetRankingChanges 获取排名变化
func (s *ReportService) GetRankingChanges(rankType string, currentStart, currentEnd, previousStart, previousEnd time.Time, limit int) ([]map[string]interface{}, error) {
	if limit <= 0 {
		limit = 10
	}

	var results []map[string]interface{}

	if rankType == "store" {
		// 门店排名变化
		s.db.Raw(`
			SELECT 
				current_rank.store_id,
				current_rank.store_name,
				current_rank.rank as current_rank,
				COALESCE(previous_rank.rank, 0) as previous_rank,
				current_rank.rank - COALESCE(previous_rank.rank, 0) as rank_change
			FROM (
				SELECT store_id, st.name as store_name, 
					ROW_NUMBER() OVER (ORDER BY SUM(total_amount) DESC) as rank
				FROM orders o
				JOIN stores st ON st.id = o.store_id
				WHERE o.created_at >= ? AND o.created_at <= ?
				GROUP BY store_id, st.name
			) current_rank
			LEFT JOIN (
				SELECT store_id,
					ROW_NUMBER() OVER (ORDER BY SUM(total_amount) DESC) as rank
				FROM orders
				WHERE created_at >= ? AND created_at <= ?
				GROUP BY store_id
			) previous_rank ON current_rank.store_id = previous_rank.store_id
			LIMIT ?
		`, currentStart, currentEnd, previousStart, previousEnd, limit).Scan(&results)
	} else {
		// 供应商排名变化
		s.db.Raw(`
			SELECT 
				current_rank.supplier_id,
				current_rank.supplier_name,
				current_rank.rank as current_rank,
				COALESCE(previous_rank.rank, 0) as previous_rank,
				current_rank.rank - COALESCE(previous_rank.rank, 0) as rank_change
			FROM (
				SELECT supplier_id, sp.name as supplier_name,
					ROW_NUMBER() OVER (ORDER BY SUM(total_amount) DESC) as rank
				FROM orders o
				JOIN suppliers sp ON sp.id = o.supplier_id
				WHERE o.created_at >= ? AND o.created_at <= ?
				GROUP BY supplier_id, sp.name
			) current_rank
			LEFT JOIN (
				SELECT supplier_id,
					ROW_NUMBER() OVER (ORDER BY SUM(total_amount) DESC) as rank
				FROM orders
				WHERE created_at >= ? AND created_at <= ?
				GROUP BY supplier_id
			) previous_rank ON current_rank.supplier_id = previous_rank.supplier_id
			LIMIT ?
		`, currentStart, currentEnd, previousStart, previousEnd, limit).Scan(&results)
	}

	return results, nil
}

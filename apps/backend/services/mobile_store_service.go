package services

import (
	"time"

	"gorm.io/gorm"
)

// MobileStoreService 门店端移动服务
type MobileStoreService struct {
	db *gorm.DB
}

// NewMobileStoreService 创建门店端移动服务
func NewMobileStoreService(db *gorm.DB) *MobileStoreService {
	return &MobileStoreService{db: db}
}

// MaterialCard 物料卡片
type MaterialCard struct {
	ID           uint64  `json:"id"`
	Name         string  `json:"name"`
	Image        string  `json:"image"`
	CategoryID   uint64  `json:"categoryId"`
	CategoryName string  `json:"categoryName"`
	BrandCount   int     `json:"brandCount"`
	SpecCount    int     `json:"specCount"`
	MinPrice     float64 `json:"minPrice"`
}

// MaterialDetail 物料详情
type MaterialDetail struct {
	ID          uint64          `json:"id"`
	Name        string          `json:"name"`
	Image       string          `json:"image"`
	CategoryID  uint64          `json:"categoryId"`
	Brands      []string        `json:"brands"`
	Specs       []string        `json:"specs"`
	Suppliers   []SupplierQuote `json:"suppliers"`
}

// SupplierQuote 供应商报价
type SupplierQuote struct {
	SupplierID   uint64   `json:"supplierId"`
	SupplierName string   `json:"supplierName"`
	Price        float64  `json:"price"`
	MinOrderQty  int      `json:"minOrderQty"`
	MinOrderAmt  float64  `json:"minOrderAmt"`
	DeliveryDays []string `json:"deliveryDays"`
	IsLowest     bool     `json:"isLowest"`
	InStock      bool     `json:"inStock"`
}

// CartItem 购物车项
type CartItem struct {
	ID           uint64  `json:"id"`
	MaterialID   uint64  `json:"materialId"`
	MaterialName string  `json:"materialName"`
	Image        string  `json:"image"`
	Brand        string  `json:"brand"`
	Spec         string  `json:"spec"`
	SupplierID   uint64  `json:"supplierId"`
	SupplierName string  `json:"supplierName"`
	Price        float64 `json:"price"`
	Quantity     int     `json:"quantity"`
	Subtotal     float64 `json:"subtotal"`
}

// CartGroup 购物车分组（按供应商）
type CartGroup struct {
	SupplierID     uint64     `json:"supplierId"`
	SupplierName   string     `json:"supplierName"`
	MinOrderAmount float64    `json:"minOrderAmount"`
	CurrentAmount  float64    `json:"currentAmount"`
	CanCheckout    bool       `json:"canCheckout"`
	Gap            float64    `json:"gap"`
	Items          []CartItem `json:"items"`
}

// GetHomeCategories 获取首页分类
func (s *MobileStoreService) GetHomeCategories() ([]map[string]interface{}, error) {
	var categories []map[string]interface{}
	err := s.db.Table("categories").
		Select("id, name, icon").
		Where("parent_id IS NULL OR parent_id = 0").
		Where("is_active = ?", true).
		Order("sort_order ASC").
		Limit(10).
		Scan(&categories).Error
	return categories, err
}

// GetHotMaterials 获取热门物料
func (s *MobileStoreService) GetHotMaterials(storeID uint64, page, pageSize int) ([]MaterialCard, int64, error) {
	var materials []MaterialCard
	var total int64

	query := s.db.Table("materials m").
		Select(`
			m.id,
			m.name,
			m.image,
			m.category_id,
			c.name as category_name,
			(SELECT COUNT(DISTINCT brand) FROM material_skus WHERE material_id = m.id) as brand_count,
			(SELECT COUNT(DISTINCT spec) FROM material_skus WHERE material_id = m.id) as spec_count,
			(SELECT MIN(sp.price) FROM supplier_products sp 
			 JOIN material_skus ms ON ms.id = sp.material_sku_id 
			 WHERE ms.material_id = m.id AND sp.is_active = true) as min_price
		`).
		Joins("LEFT JOIN categories c ON c.id = m.category_id").
		Where("m.is_active = ?", true)

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("m.order_count DESC").Offset(offset).Limit(pageSize).Scan(&materials).Error
	return materials, total, err
}

// SearchMaterials 搜索物料
func (s *MobileStoreService) SearchMaterials(keyword string, categoryID *uint64, page, pageSize int) ([]MaterialCard, int64, error) {
	var materials []MaterialCard
	var total int64

	query := s.db.Table("materials m").
		Select(`
			m.id,
			m.name,
			m.image,
			m.category_id,
			c.name as category_name,
			(SELECT COUNT(DISTINCT brand) FROM material_skus WHERE material_id = m.id) as brand_count,
			(SELECT COUNT(DISTINCT spec) FROM material_skus WHERE material_id = m.id) as spec_count,
			(SELECT MIN(sp.price) FROM supplier_products sp 
			 JOIN material_skus ms ON ms.id = sp.material_sku_id 
			 WHERE ms.material_id = m.id AND sp.is_active = true) as min_price
		`).
		Joins("LEFT JOIN categories c ON c.id = m.category_id").
		Where("m.is_active = ?", true)

	if keyword != "" {
		query = query.Where("m.name LIKE ?", "%"+keyword+"%")
	}
	if categoryID != nil {
		query = query.Where("m.category_id = ?", *categoryID)
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&materials).Error
	return materials, total, err
}

// GetMaterialDetail 获取物料详情
func (s *MobileStoreService) GetMaterialDetail(storeID, materialID uint64) (*MaterialDetail, error) {
	var detail MaterialDetail

	// 获取物料基本信息
	err := s.db.Table("materials").Where("id = ?", materialID).First(&detail).Error
	if err != nil {
		return nil, err
	}

	// 获取品牌列表
	s.db.Table("material_skus").
		Select("DISTINCT brand").
		Where("material_id = ?", materialID).
		Pluck("brand", &detail.Brands)

	// 获取规格列表
	s.db.Table("material_skus").
		Select("DISTINCT spec").
		Where("material_id = ?", materialID).
		Pluck("spec", &detail.Specs)

	// 获取供应商报价
	var quotes []SupplierQuote
	s.db.Table("supplier_products sp").
		Select(`
			sp.supplier_id,
			s.name as supplier_name,
			sp.price,
			sp.min_order_qty,
			ds.min_order_amount as min_order_amt,
			sp.in_stock
		`).
		Joins("JOIN suppliers s ON s.id = sp.supplier_id").
		Joins("LEFT JOIN delivery_settings ds ON ds.supplier_id = sp.supplier_id").
		Joins("JOIN material_skus ms ON ms.id = sp.material_sku_id").
		Where("ms.material_id = ? AND sp.is_active = ?", materialID, true).
		Scan(&quotes)

	// 标记最低价
	if len(quotes) > 0 {
		minPrice := quotes[0].Price
		minIdx := 0
		for i, q := range quotes {
			if q.Price < minPrice {
				minPrice = q.Price
				minIdx = i
			}
		}
		quotes[minIdx].IsLowest = true
	}
	detail.Suppliers = quotes

	return &detail, nil
}

// GetCart 获取购物车
func (s *MobileStoreService) GetCart(storeID uint64) ([]CartGroup, error) {
	var items []CartItem
	s.db.Table("cart_items ci").
		Select(`
			ci.id,
			ci.material_id,
			m.name as material_name,
			m.image,
			ms.brand,
			ms.spec,
			ci.supplier_id,
			s.name as supplier_name,
			ci.price,
			ci.quantity,
			ci.price * ci.quantity as subtotal
		`).
		Joins("JOIN materials m ON m.id = ci.material_id").
		Joins("JOIN material_skus ms ON ms.id = ci.material_sku_id").
		Joins("JOIN suppliers s ON s.id = ci.supplier_id").
		Where("ci.store_id = ?", storeID).
		Scan(&items)

	// 按供应商分组
	groupMap := make(map[uint64]*CartGroup)
	for _, item := range items {
		if _, exists := groupMap[item.SupplierID]; !exists {
			var minAmt float64
			s.db.Table("delivery_settings").
				Select("min_order_amount").
				Where("supplier_id = ?", item.SupplierID).
				Scan(&minAmt)

			groupMap[item.SupplierID] = &CartGroup{
				SupplierID:     item.SupplierID,
				SupplierName:   item.SupplierName,
				MinOrderAmount: minAmt,
				Items:          []CartItem{},
			}
		}
		groupMap[item.SupplierID].Items = append(groupMap[item.SupplierID].Items, item)
		groupMap[item.SupplierID].CurrentAmount += item.Subtotal
	}

	var groups []CartGroup
	for _, g := range groupMap {
		g.CanCheckout = g.CurrentAmount >= g.MinOrderAmount
		if !g.CanCheckout {
			g.Gap = g.MinOrderAmount - g.CurrentAmount
		}
		groups = append(groups, *g)
	}

	return groups, nil
}

// AddToCart 加入购物车
func (s *MobileStoreService) AddToCart(storeID, materialID, materialSkuID, supplierID uint64, quantity int, price float64) error {
	// 检查是否已存在
	var existingID uint64
	s.db.Table("cart_items").
		Select("id").
		Where("store_id = ? AND material_sku_id = ? AND supplier_id = ?", storeID, materialSkuID, supplierID).
		Scan(&existingID)

	if existingID > 0 {
		// 更新数量
		return s.db.Table("cart_items").
			Where("id = ?", existingID).
			Update("quantity", gorm.Expr("quantity + ?", quantity)).Error
	}

	// 新增
	return s.db.Table("cart_items").Create(map[string]interface{}{
		"store_id":        storeID,
		"material_id":     materialID,
		"material_sku_id": materialSkuID,
		"supplier_id":     supplierID,
		"quantity":        quantity,
		"price":           price,
		"created_at":      time.Now(),
		"updated_at":      time.Now(),
	}).Error
}

// UpdateCartItemQuantity 更新购物车数量
func (s *MobileStoreService) UpdateCartItemQuantity(cartItemID uint64, quantity int) error {
	if quantity <= 0 {
		return s.db.Table("cart_items").Where("id = ?", cartItemID).Delete(nil).Error
	}
	return s.db.Table("cart_items").Where("id = ?", cartItemID).Update("quantity", quantity).Error
}

// RemoveFromCart 从购物车移除
func (s *MobileStoreService) RemoveFromCart(cartItemID uint64) error {
	return s.db.Table("cart_items").Where("id = ?", cartItemID).Delete(nil).Error
}

// GetStoreStats 获取门店统计
func (s *MobileStoreService) GetStoreStats(storeID uint64) (map[string]interface{}, error) {
	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	var monthOrders int64
	var monthAmount float64
	var supplierCount int64

	s.db.Table("orders").Where("store_id = ? AND created_at >= ?", storeID, monthStart).Count(&monthOrders)
	s.db.Table("orders").Where("store_id = ? AND created_at >= ?", storeID, monthStart).Select("COALESCE(SUM(total_amount), 0)").Scan(&monthAmount)
	s.db.Table("orders").Where("store_id = ?", storeID).Select("COUNT(DISTINCT supplier_id)").Scan(&supplierCount)

	return map[string]interface{}{
		"monthOrders":   monthOrders,
		"monthAmount":   monthAmount,
		"supplierCount": supplierCount,
	}, nil
}

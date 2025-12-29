package services

import (
	"time"

	"gorm.io/gorm"
)

// MobileSupplierService 供应商端移动服务
type MobileSupplierService struct {
	db *gorm.DB
}

// NewMobileSupplierService 创建供应商端移动服务
func NewMobileSupplierService(db *gorm.DB) *MobileSupplierService {
	return &MobileSupplierService{db: db}
}

// SupplierHomeStats 供应商首页统计
type SupplierHomeStats struct {
	TodayOrderAmount   float64 `json:"todayOrderAmount"`
	PendingOrderCount  int64   `json:"pendingOrderCount"`
	ProcessingCount    int64   `json:"processingCount"`
	CompletedCount     int64   `json:"completedCount"`
}

// SupplierOrderCard 供应商订单卡片
type SupplierOrderCard struct {
	ID            uint64    `json:"id"`
	OrderNo       string    `json:"orderNo"`
	StoreName     string    `json:"storeName"`
	TotalAmount   float64   `json:"totalAmount"`
	ItemCount     int       `json:"itemCount"`
	Status        string    `json:"status"`
	DeliveryDate  string    `json:"deliveryDate"`
	CreatedAt     time.Time `json:"createdAt"`
}

// SupplierOrderDetail 供应商订单详情
type SupplierOrderDetail struct {
	ID             uint64                `json:"id"`
	OrderNo        string                `json:"orderNo"`
	Status         string                `json:"status"`
	StoreName      string                `json:"storeName"`
	StoreAddress   string                `json:"storeAddress"`
	StorePhone     string                `json:"storePhone"`
	DeliveryDate   string                `json:"deliveryDate"`
	TotalAmount    float64               `json:"totalAmount"`
	Remark         string                `json:"remark"`
	Items          []SupplierOrderItem   `json:"items"`
	CreatedAt      time.Time             `json:"createdAt"`
}

// SupplierOrderItem 供应商订单项
type SupplierOrderItem struct {
	ID           uint64  `json:"id"`
	MaterialName string  `json:"materialName"`
	Brand        string  `json:"brand"`
	Spec         string  `json:"spec"`
	Price        float64 `json:"price"` // 供应商原价，不含加价
	Quantity     int     `json:"quantity"`
	Subtotal     float64 `json:"subtotal"`
}

// SupplierProduct 供应商产品
type SupplierProduct struct {
	ID           uint64  `json:"id"`
	MaterialID   uint64  `json:"materialId"`
	MaterialName string  `json:"materialName"`
	Brand        string  `json:"brand"`
	Spec         string  `json:"spec"`
	Price        float64 `json:"price"`
	InStock      bool    `json:"inStock"`
	MinOrderQty  int     `json:"minOrderQty"`
}

// GetHomeStats 获取首页统计
func (s *MobileSupplierService) GetHomeStats(supplierID uint64) (*SupplierHomeStats, error) {
	stats := &SupplierHomeStats{}
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	// 今日订单金额
	s.db.Table("orders").
		Where("supplier_id = ? AND created_at >= ?", supplierID, todayStart).
		Select("COALESCE(SUM(supplier_amount), 0)").
		Scan(&stats.TodayOrderAmount)

	// 待处理订单数
	s.db.Table("orders").
		Where("supplier_id = ? AND status = ?", supplierID, "pending").
		Count(&stats.PendingOrderCount)

	// 进行中订单数
	s.db.Table("orders").
		Where("supplier_id = ? AND status IN ?", supplierID, []string{"confirmed", "delivering"}).
		Count(&stats.ProcessingCount)

	// 已完成订单数（今日）
	s.db.Table("orders").
		Where("supplier_id = ? AND status = ? AND updated_at >= ?", supplierID, "completed", todayStart).
		Count(&stats.CompletedCount)

	return stats, nil
}

// GetPendingOrders 获取待处理订单
func (s *MobileSupplierService) GetPendingOrders(supplierID uint64, limit int) ([]SupplierOrderCard, error) {
	var orders []SupplierOrderCard
	err := s.db.Table("orders o").
		Select(`
			o.id,
			o.order_no,
			st.name as store_name,
			o.supplier_amount as total_amount,
			(SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
			o.status,
			o.delivery_date,
			o.created_at
		`).
		Joins("JOIN stores st ON st.id = o.store_id").
		Where("o.supplier_id = ? AND o.status = ?", supplierID, "pending").
		Order("o.created_at DESC").
		Limit(limit).
		Scan(&orders).Error
	return orders, err
}

// GetOrderList 获取订单列表
func (s *MobileSupplierService) GetOrderList(supplierID uint64, status string, page, pageSize int) ([]SupplierOrderCard, int64, error) {
	var orders []SupplierOrderCard
	var total int64

	query := s.db.Table("orders o").
		Select(`
			o.id,
			o.order_no,
			st.name as store_name,
			o.supplier_amount as total_amount,
			(SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
			o.status,
			o.delivery_date,
			o.created_at
		`).
		Joins("JOIN stores st ON st.id = o.store_id").
		Where("o.supplier_id = ?", supplierID)

	if status != "" && status != "all" {
		switch status {
		case "pending":
			query = query.Where("o.status = ?", "pending")
		case "processing":
			query = query.Where("o.status IN ?", []string{"confirmed", "delivering"})
		case "completed":
			query = query.Where("o.status = ?", "completed")
		}
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("o.created_at DESC").Offset(offset).Limit(pageSize).Scan(&orders).Error
	return orders, total, err
}

// GetOrderDetail 获取订单详情
func (s *MobileSupplierService) GetOrderDetail(supplierID, orderID uint64) (*SupplierOrderDetail, error) {
	var detail SupplierOrderDetail
	err := s.db.Table("orders o").
		Select(`
			o.id,
			o.order_no,
			o.status,
			st.name as store_name,
			st.address as store_address,
			st.phone as store_phone,
			o.delivery_date,
			o.supplier_amount as total_amount,
			o.remark,
			o.created_at
		`).
		Joins("JOIN stores st ON st.id = o.store_id").
		Where("o.id = ? AND o.supplier_id = ?", orderID, supplierID).
		First(&detail).Error
	if err != nil {
		return nil, err
	}

	// 获取订单项
	s.db.Table("order_items oi").
		Select(`
			oi.id,
			m.name as material_name,
			ms.brand,
			ms.spec,
			oi.supplier_price as price,
			oi.quantity,
			oi.supplier_price * oi.quantity as subtotal
		`).
		Joins("JOIN material_skus ms ON ms.id = oi.material_sku_id").
		Joins("JOIN materials m ON m.id = ms.material_id").
		Where("oi.order_id = ?", orderID).
		Scan(&detail.Items)

	return &detail, nil
}

// ConfirmOrder 确认订单
func (s *MobileSupplierService) ConfirmOrder(supplierID, orderID uint64) error {
	return s.db.Table("orders").
		Where("id = ? AND supplier_id = ? AND status = ?", orderID, supplierID, "pending").
		Updates(map[string]interface{}{
			"status":     "confirmed",
			"updated_at": time.Now(),
		}).Error
}

// StartDelivery 开始配送
func (s *MobileSupplierService) StartDelivery(supplierID, orderID uint64) error {
	return s.db.Table("orders").
		Where("id = ? AND supplier_id = ? AND status = ?", orderID, supplierID, "confirmed").
		Updates(map[string]interface{}{
			"status":     "delivering",
			"updated_at": time.Now(),
		}).Error
}

// CompleteOrder 完成订单
func (s *MobileSupplierService) CompleteOrder(supplierID, orderID uint64) error {
	return s.db.Table("orders").
		Where("id = ? AND supplier_id = ? AND status = ?", orderID, supplierID, "delivering").
		Updates(map[string]interface{}{
			"status":       "completed",
			"completed_at": time.Now(),
			"updated_at":   time.Now(),
		}).Error
}

// GetProducts 获取产品列表
func (s *MobileSupplierService) GetProducts(supplierID uint64, keyword string, page, pageSize int) ([]SupplierProduct, int64, error) {
	var products []SupplierProduct
	var total int64

	query := s.db.Table("supplier_products sp").
		Select(`
			sp.id,
			sp.material_sku_id as material_id,
			m.name as material_name,
			ms.brand,
			ms.spec,
			sp.price,
			sp.in_stock,
			sp.min_order_qty
		`).
		Joins("JOIN material_skus ms ON ms.id = sp.material_sku_id").
		Joins("JOIN materials m ON m.id = ms.material_id").
		Where("sp.supplier_id = ?", supplierID)

	if keyword != "" {
		query = query.Where("m.name LIKE ? OR ms.brand LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Scan(&products).Error
	return products, total, err
}

// UpdateProductPrice 更新产品价格
func (s *MobileSupplierService) UpdateProductPrice(supplierID, productID uint64, price float64) error {
	return s.db.Table("supplier_products").
		Where("id = ? AND supplier_id = ?", productID, supplierID).
		Update("price", price).Error
}

// UpdateProductStock 更新产品库存状态
func (s *MobileSupplierService) UpdateProductStock(supplierID, productID uint64, inStock bool) error {
	return s.db.Table("supplier_products").
		Where("id = ? AND supplier_id = ?", productID, supplierID).
		Update("in_stock", inStock).Error
}

// GetSupplierProfile 获取供应商信息
func (s *MobileSupplierService) GetSupplierProfile(supplierID uint64) (map[string]interface{}, error) {
	var supplier map[string]interface{}
	err := s.db.Table("suppliers").Where("id = ?", supplierID).First(&supplier).Error
	if err != nil {
		return nil, err
	}

	// 获取今日统计
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	var todayOrders int64
	var todayAmount float64
	s.db.Table("orders").Where("supplier_id = ? AND created_at >= ?", supplierID, todayStart).Count(&todayOrders)
	s.db.Table("orders").Where("supplier_id = ? AND created_at >= ?", supplierID, todayStart).Select("COALESCE(SUM(supplier_amount), 0)").Scan(&todayAmount)

	supplier["todayOrders"] = todayOrders
	supplier["todayAmount"] = todayAmount

	return supplier, nil
}

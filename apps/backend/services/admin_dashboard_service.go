package services

import (
	"time"

	"gorm.io/gorm"
)

// AdminDashboardService 管理员看板服务
type AdminDashboardService struct {
	db *gorm.DB
}

// NewAdminDashboardService 创建管理员看板服务
func NewAdminDashboardService(db *gorm.DB) *AdminDashboardService {
	return &AdminDashboardService{db: db}
}

// DashboardStats 看板统计数据
type DashboardStats struct {
	TodayOrderCount    int64   `json:"todayOrderCount"`
	TodayOrderAmount   float64 `json:"todayOrderAmount"`
	MonthOrderCount    int64   `json:"monthOrderCount"`
	MonthMarkupIncome  float64 `json:"monthMarkupIncome"`
}

// OrderTrend 订单趋势数据
type OrderTrend struct {
	Date        string  `json:"date"`
	OrderCount  int64   `json:"orderCount"`
	OrderAmount float64 `json:"orderAmount"`
}

// RankingItem 排行项
type RankingItem struct {
	ID     uint64  `json:"id"`
	Name   string  `json:"name"`
	Amount float64 `json:"amount"`
	Count  int64   `json:"count"`
}

// OrderStatusStats 订单状态统计
type OrderStatusStats struct {
	Status string `json:"status"`
	Count  int64  `json:"count"`
}

// GetDashboardStats 获取看板统计数据
func (s *AdminDashboardService) GetDashboardStats() (*DashboardStats, error) {
	stats := &DashboardStats{}
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// 今日订单数
	s.db.Table("orders").
		Where("created_at >= ?", todayStart).
		Count(&stats.TodayOrderCount)

	// 今日订货金额
	s.db.Table("orders").
		Select("COALESCE(SUM(total_amount), 0)").
		Where("created_at >= ?", todayStart).
		Scan(&stats.TodayOrderAmount)

	// 本月订单数
	s.db.Table("orders").
		Where("created_at >= ?", monthStart).
		Count(&stats.MonthOrderCount)

	// 本月加价收入
	s.db.Table("orders").
		Select("COALESCE(SUM(markup_amount), 0)").
		Where("created_at >= ?", monthStart).
		Scan(&stats.MonthMarkupIncome)

	return stats, nil
}

// GetOrderTrend 获取订单趋势（近30天）
func (s *AdminDashboardService) GetOrderTrend(days int) ([]OrderTrend, error) {
	if days <= 0 {
		days = 30
	}

	var trends []OrderTrend
	startDate := time.Now().AddDate(0, 0, -days)

	err := s.db.Table("orders").
		Select("DATE(created_at) as date, COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as order_amount").
		Where("created_at >= ?", startDate).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&trends).Error

	return trends, err
}

// GetSupplierRanking 获取供应商订单排行
func (s *AdminDashboardService) GetSupplierRanking(limit int) ([]RankingItem, error) {
	if limit <= 0 {
		limit = 5
	}

	var ranking []RankingItem
	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	err := s.db.Table("orders o").
		Select("o.supplier_id as id, s.name, COALESCE(SUM(o.total_amount), 0) as amount, COUNT(*) as count").
		Joins("JOIN suppliers s ON s.id = o.supplier_id").
		Where("o.created_at >= ?", monthStart).
		Group("o.supplier_id, s.name").
		Order("amount DESC").
		Limit(limit).
		Scan(&ranking).Error

	return ranking, err
}

// GetStoreRanking 获取门店订货排行
func (s *AdminDashboardService) GetStoreRanking(limit int) ([]RankingItem, error) {
	if limit <= 0 {
		limit = 5
	}

	var ranking []RankingItem
	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	err := s.db.Table("orders o").
		Select("o.store_id as id, st.name, COALESCE(SUM(o.total_amount), 0) as amount, COUNT(*) as count").
		Joins("JOIN stores st ON st.id = o.store_id").
		Where("o.created_at >= ?", monthStart).
		Group("o.store_id, st.name").
		Order("amount DESC").
		Limit(limit).
		Scan(&ranking).Error

	return ranking, err
}

// GetOrderStatusStats 获取订单状态分布统计
func (s *AdminDashboardService) GetOrderStatusStats() ([]OrderStatusStats, error) {
	var stats []OrderStatusStats

	err := s.db.Table("orders").
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&stats).Error

	return stats, err
}

// CancelRequest 取消申请
type CancelRequest struct {
	ID            uint64    `json:"id"`
	OrderID       uint64    `json:"orderId"`
	OrderNo       string    `json:"orderNo"`
	StoreName     string    `json:"storeName"`
	SupplierName  string    `json:"supplierName"`
	Amount        float64   `json:"amount"`
	Reason        string    `json:"reason"`
	RequestedAt   time.Time `json:"requestedAt"`
	Status        string    `json:"status"`
}

// GetPendingCancelRequests 获取待审批取消申请列表
func (s *AdminDashboardService) GetPendingCancelRequests(page, pageSize int) ([]CancelRequest, int64, error) {
	var requests []CancelRequest
	var total int64

	query := s.db.Table("order_cancel_requests ocr").
		Select(`
			ocr.id,
			ocr.order_id,
			o.order_no,
			st.name as store_name,
			sp.name as supplier_name,
			o.total_amount as amount,
			ocr.reason,
			ocr.created_at as requested_at,
			ocr.status
		`).
		Joins("JOIN orders o ON o.id = ocr.order_id").
		Joins("JOIN stores st ON st.id = o.store_id").
		Joins("JOIN suppliers sp ON sp.id = o.supplier_id").
		Where("ocr.status = ?", "pending")

	query.Count(&total)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	err := query.Order("ocr.created_at DESC").Offset(offset).Limit(pageSize).Scan(&requests).Error
	return requests, total, err
}

// ApproveCancelRequest 批准取消申请
func (s *AdminDashboardService) ApproveCancelRequest(requestID uint64, auditorID uint64) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 更新申请状态
		if err := tx.Table("order_cancel_requests").
			Where("id = ?", requestID).
			Updates(map[string]interface{}{
				"status":     "approved",
				"audited_by": auditorID,
				"audited_at": time.Now(),
			}).Error; err != nil {
			return err
		}

		// 获取订单ID
		var orderID uint64
		tx.Table("order_cancel_requests").
			Select("order_id").
			Where("id = ?", requestID).
			Scan(&orderID)

		// 更新订单状态为已取消
		return tx.Table("orders").
			Where("id = ?", orderID).
			Update("status", "cancelled").Error
	})
}

// RejectCancelRequest 拒绝取消申请
func (s *AdminDashboardService) RejectCancelRequest(requestID uint64, reason string, auditorID uint64) error {
	return s.db.Table("order_cancel_requests").
		Where("id = ?", requestID).
		Updates(map[string]interface{}{
			"status":        "rejected",
			"reject_reason": reason,
			"audited_by":    auditorID,
			"audited_at":    time.Now(),
		}).Error
}

// RestoreOrder 恢复已取消的订单
func (s *AdminDashboardService) RestoreOrder(orderID uint64, reason string, operatorID uint64) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 更新订单状态为待付款
		if err := tx.Table("orders").
			Where("id = ? AND status = ?", orderID, "cancelled").
			Updates(map[string]interface{}{
				"status":          "pending_payment",
				"restored_at":     time.Now(),
				"restored_by":     operatorID,
				"restore_reason":  reason,
			}).Error; err != nil {
			return err
		}

		// 记录操作日志
		return tx.Table("order_status_logs").Create(map[string]interface{}{
			"order_id":    orderID,
			"from_status": "cancelled",
			"to_status":   "pending_payment",
			"operator_id": operatorID,
			"remark":      "订单恢复: " + reason,
			"created_at":  time.Now(),
		}).Error
	})
}

// AdminCancelOrder 管理员直接取消订单
func (s *AdminDashboardService) AdminCancelOrder(orderID uint64, reason string, operatorID uint64) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 获取当前状态
		var currentStatus string
		tx.Table("orders").Select("status").Where("id = ?", orderID).Scan(&currentStatus)

		// 更新订单状态
		if err := tx.Table("orders").
			Where("id = ?", orderID).
			Updates(map[string]interface{}{
				"status":        "cancelled",
				"cancelled_at":  time.Now(),
				"cancelled_by":  operatorID,
				"cancel_reason": reason,
			}).Error; err != nil {
			return err
		}

		// 记录操作日志
		return tx.Table("order_status_logs").Create(map[string]interface{}{
			"order_id":    orderID,
			"from_status": currentStatus,
			"to_status":   "cancelled",
			"operator_id": operatorID,
			"remark":      "管理员取消: " + reason,
			"created_at":  time.Now(),
		}).Error
	})
}

package services

import (
	"errors"
	"time"

	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// OrderCancelService handles order cancellation operations
type OrderCancelService struct {
	db *gorm.DB
}

// NewOrderCancelService creates a new order cancel service instance
func NewOrderCancelService(db *gorm.DB) *OrderCancelService {
	return &OrderCancelService{db: db}
}

// CancelThresholdHours is the time limit for self-cancellation (1 hour)
const CancelThresholdHours = 1

// CanSelfCancel checks if the order can be cancelled by the store without approval
func (s *OrderCancelService) CanSelfCancel(order *models.Order) bool {
	// Only pending_confirm orders can be cancelled
	if order.Status != models.OrderStatusPendingConfirm {
		return false
	}

	// Check if within cancellation threshold
	threshold := time.Hour * CancelThresholdHours
	return time.Since(order.CreatedAt) <= threshold
}

// SelfCancelOrder cancels an order directly (within 1 hour)
func (s *OrderCancelService) SelfCancelOrder(orderID uint64, storeID uint64, reason string) error {
	var order models.Order
	if err := s.db.First(&order, orderID).Error; err != nil {
		return errors.New("order not found")
	}

	// Verify ownership
	if order.StoreID != storeID {
		return errors.New("unauthorized: order does not belong to this store")
	}

	// Check if can self cancel
	if !s.CanSelfCancel(&order) {
		return errors.New("order cannot be self-cancelled, please submit a cancellation request")
	}

	// Begin transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Update order status
	now := time.Now()
	cancelledBy := models.CancelledByStore
	updates := map[string]interface{}{
		"status":        models.OrderStatusCancelled,
		"cancel_reason": reason,
		"cancelled_by":  cancelledBy,
		"cancelled_at":  now,
	}

	if err := tx.Model(&order).Updates(updates).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Create status log
	fromStatus := string(models.OrderStatusPendingConfirm)
	toStatus := string(models.OrderStatusCancelled)
	operatorType := models.OperatorTypeStore
	log := &models.OrderStatusLog{
		OrderID:      orderID,
		FromStatus:   &fromStatus,
		ToStatus:     toStatus,
		OperatorType: &operatorType,
		OperatorID:   &storeID,
		Remark:       &reason,
	}

	if err := tx.Create(log).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// SubmitCancelRequest submits a cancellation request (after 1 hour)
func (s *OrderCancelService) SubmitCancelRequest(orderID uint64, storeID uint64, reason string) (*models.OrderCancelRequest, error) {
	var order models.Order
	if err := s.db.First(&order, orderID).Error; err != nil {
		return nil, errors.New("order not found")
	}

	// Verify ownership
	if order.StoreID != storeID {
		return nil, errors.New("unauthorized: order does not belong to this store")
	}

	// Check if order can be cancelled
	if order.Status != models.OrderStatusPendingConfirm && order.Status != models.OrderStatusConfirmed {
		return nil, errors.New("order status does not allow cancellation request")
	}

	// Check if there's already a pending request
	var existingRequest models.OrderCancelRequest
	err := s.db.Where("order_id = ? AND status = ?", orderID, models.CancelRequestPending).First(&existingRequest).Error
	if err == nil {
		return nil, errors.New("a cancellation request is already pending for this order")
	}

	// Create cancel request
	request := &models.OrderCancelRequest{
		OrderID: orderID,
		StoreID: storeID,
		Reason:  reason,
		Status:  models.CancelRequestPending,
	}

	if err := s.db.Create(request).Error; err != nil {
		return nil, err
	}

	return request, nil
}

// GetCancelRequest gets a cancel request by order ID
func (s *OrderCancelService) GetCancelRequest(orderID uint64) (*models.OrderCancelRequest, error) {
	var request models.OrderCancelRequest
	if err := s.db.Where("order_id = ?", orderID).Order("created_at DESC").First(&request).Error; err != nil {
		return nil, err
	}
	return &request, nil
}

// GetPendingCancelRequests gets all pending cancel requests
func (s *OrderCancelService) GetPendingCancelRequests(page, pageSize int) ([]models.OrderCancelRequest, int64, error) {
	var requests []models.OrderCancelRequest
	var total int64

	query := s.db.Model(&models.OrderCancelRequest{}).Where("status = ?", models.CancelRequestPending)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).
		Preload("Order").
		Preload("Store").
		Order("created_at ASC").
		Find(&requests).Error; err != nil {
		return nil, 0, err
	}

	return requests, total, nil
}

// ApproveCancelRequest approves a cancel request
func (s *OrderCancelService) ApproveCancelRequest(requestID uint64, adminID uint64, remark string) error {
	var request models.OrderCancelRequest
	if err := s.db.First(&request, requestID).Error; err != nil {
		return errors.New("cancel request not found")
	}

	if request.Status != models.CancelRequestPending {
		return errors.New("cancel request is not pending")
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Update cancel request
	request.Approve(adminID, remark)
	if err := tx.Save(&request).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update order status
	var order models.Order
	if err := tx.First(&order, request.OrderID).Error; err != nil {
		tx.Rollback()
		return err
	}

	now := time.Now()
	cancelledBy := models.CancelledByAdmin
	updates := map[string]interface{}{
		"status":          models.OrderStatusCancelled,
		"cancel_reason":   request.Reason,
		"cancelled_by":    cancelledBy,
		"cancelled_by_id": adminID,
		"cancelled_at":    now,
	}

	if err := tx.Model(&order).Updates(updates).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Create status log
	fromStatus := string(order.Status)
	toStatus := string(models.OrderStatusCancelled)
	operatorType := models.OperatorTypeAdmin
	remarkText := "取消申请已批准: " + remark
	log := &models.OrderStatusLog{
		OrderID:      request.OrderID,
		FromStatus:   &fromStatus,
		ToStatus:     toStatus,
		OperatorType: &operatorType,
		OperatorID:   &adminID,
		Remark:       &remarkText,
	}

	if err := tx.Create(log).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// RejectCancelRequest rejects a cancel request
func (s *OrderCancelService) RejectCancelRequest(requestID uint64, adminID uint64, reason string) error {
	var request models.OrderCancelRequest
	if err := s.db.First(&request, requestID).Error; err != nil {
		return errors.New("cancel request not found")
	}

	if request.Status != models.CancelRequestPending {
		return errors.New("cancel request is not pending")
	}

	request.Reject(adminID, reason)
	return s.db.Save(&request).Error
}

// RestoreOrder restores a cancelled order
func (s *OrderCancelService) RestoreOrder(orderID uint64, adminID uint64, reason string) error {
	var order models.Order
	if err := s.db.First(&order, orderID).Error; err != nil {
		return errors.New("order not found")
	}

	if order.Status != models.OrderStatusCancelled {
		return errors.New("order is not cancelled")
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Update order status to unpaid (needs re-payment)
	now := time.Now()
	updates := map[string]interface{}{
		"status":      models.OrderStatusUnpaid,
		"restored_at": now,
	}

	if err := tx.Model(&order).Updates(updates).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Create status log
	fromStatus := string(models.OrderStatusCancelled)
	toStatus := string(models.OrderStatusUnpaid)
	operatorType := models.OperatorTypeAdmin
	log := &models.OrderStatusLog{
		OrderID:      orderID,
		FromStatus:   &fromStatus,
		ToStatus:     toStatus,
		OperatorType: &operatorType,
		OperatorID:   &adminID,
		Remark:       &reason,
	}

	if err := tx.Create(log).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

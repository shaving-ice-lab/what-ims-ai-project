package types

import (
	"testing"
	"time"
)

func TestNewApiResponse(t *testing.T) {
	data := map[string]string{"key": "value"}
	resp := NewApiResponse(data)

	if resp.Code != 0 {
		t.Errorf("Expected code 0, got %d", resp.Code)
	}
	if resp.Message != "success" {
		t.Errorf("Expected message 'success', got '%s'", resp.Message)
	}
	if resp.Data == nil {
		t.Error("Expected data to not be nil")
	}
	if resp.Timestamp == 0 {
		t.Error("Expected timestamp to be set")
	}
}

func TestNewApiError(t *testing.T) {
	resp := NewApiError(400, "Bad Request")

	if resp.Code != 400 {
		t.Errorf("Expected code 400, got %d", resp.Code)
	}
	if resp.Message != "Bad Request" {
		t.Errorf("Expected message 'Bad Request', got '%s'", resp.Message)
	}
	if resp.Data != nil {
		t.Error("Expected data to be nil")
	}
}

func TestNewPaginatedResponse(t *testing.T) {
	items := []string{"item1", "item2"}
	resp := NewPaginatedResponse(items, 100, 1, 10)

	if resp.Total != 100 {
		t.Errorf("Expected total 100, got %d", resp.Total)
	}
	if resp.Page != 1 {
		t.Errorf("Expected page 1, got %d", resp.Page)
	}
	if resp.PageSize != 10 {
		t.Errorf("Expected pageSize 10, got %d", resp.PageSize)
	}
}

func TestUserRoleConstants(t *testing.T) {
	if RoleAdmin != "admin" {
		t.Errorf("Expected 'admin', got '%s'", RoleAdmin)
	}
	if RoleSubAdmin != "sub_admin" {
		t.Errorf("Expected 'sub_admin', got '%s'", RoleSubAdmin)
	}
	if RoleSupplier != "supplier" {
		t.Errorf("Expected 'supplier', got '%s'", RoleSupplier)
	}
	if RoleStore != "store" {
		t.Errorf("Expected 'store', got '%s'", RoleStore)
	}
}

func TestOrderStatusConstants(t *testing.T) {
	statuses := []OrderStatus{
		OrderPendingPayment,
		OrderPendingConfirm,
		OrderConfirmed,
		OrderDelivering,
		OrderCompleted,
		OrderCancelled,
	}

	expected := []string{
		"pending_payment",
		"pending_confirm",
		"confirmed",
		"delivering",
		"completed",
		"cancelled",
	}

	for i, status := range statuses {
		if string(status) != expected[i] {
			t.Errorf("Expected '%s', got '%s'", expected[i], status)
		}
	}
}

func TestPaymentStatusConstants(t *testing.T) {
	if PaymentUnpaid != "unpaid" {
		t.Errorf("Expected 'unpaid', got '%s'", PaymentUnpaid)
	}
	if PaymentPaid != "paid" {
		t.Errorf("Expected 'paid', got '%s'", PaymentPaid)
	}
	if PaymentRefunded != "refunded" {
		t.Errorf("Expected 'refunded', got '%s'", PaymentRefunded)
	}
}

func TestStockStatusConstants(t *testing.T) {
	if StockInStock != "in_stock" {
		t.Errorf("Expected 'in_stock', got '%s'", StockInStock)
	}
	if StockOutOfStock != "out_of_stock" {
		t.Errorf("Expected 'out_of_stock', got '%s'", StockOutOfStock)
	}
}

func TestMarkupTypeConstants(t *testing.T) {
	if MarkupFixed != "fixed" {
		t.Errorf("Expected 'fixed', got '%s'", MarkupFixed)
	}
	if MarkupPercent != "percent" {
		t.Errorf("Expected 'percent', got '%s'", MarkupPercent)
	}
}

func TestDeliveryModeConstants(t *testing.T) {
	if SelfDelivery != "self_delivery" {
		t.Errorf("Expected 'self_delivery', got '%s'", SelfDelivery)
	}
	if ExpressDelivery != "express_delivery" {
		t.Errorf("Expected 'express_delivery', got '%s'", ExpressDelivery)
	}
}

func TestWebhookEventConstants(t *testing.T) {
	events := []WebhookEvent{
		WebhookNewOrder,
		WebhookOrderConfirmed,
		WebhookOrderDelivered,
		WebhookOrderCompleted,
		WebhookOrderCancelled,
		WebhookPriceUpdated,
		WebhookStockChanged,
	}

	expected := []string{
		"new_order",
		"order_confirmed",
		"order_delivered",
		"order_completed",
		"order_cancelled",
		"price_updated",
		"stock_changed",
	}

	for i, event := range events {
		if string(event) != expected[i] {
			t.Errorf("Expected '%s', got '%s'", expected[i], event)
		}
	}
}

func TestWebhookPayload(t *testing.T) {
	payload := WebhookPayload{
		Event:     WebhookNewOrder,
		Timestamp: time.Now().Unix(),
		Data:      map[string]string{"orderId": "123"},
	}

	if payload.Event != WebhookNewOrder {
		t.Errorf("Expected event '%s', got '%s'", WebhookNewOrder, payload.Event)
	}
	if payload.Timestamp == 0 {
		t.Error("Expected timestamp to be set")
	}
}

func TestSystemConfigKeys(t *testing.T) {
	if ConfigServiceFeeRate != "service_fee_rate" {
		t.Errorf("Expected 'service_fee_rate', got '%s'", ConfigServiceFeeRate)
	}
	if ConfigWebhookRetryTimes != "webhook_retry_times" {
		t.Errorf("Expected 'webhook_retry_times', got '%s'", ConfigWebhookRetryTimes)
	}
}

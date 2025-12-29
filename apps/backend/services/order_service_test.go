package services

import (
	"testing"
	"time"
)

func TestCalculateOrderAmount(t *testing.T) {
	tests := []struct {
		name     string
		items    []OrderItemInput
		expected float64
	}{
		{
			name: "Single item",
			items: []OrderItemInput{
				{MaterialID: 1, Quantity: 2, Price: 10.0},
			},
			expected: 20.0,
		},
		{
			name: "Multiple items",
			items: []OrderItemInput{
				{MaterialID: 1, Quantity: 2, Price: 10.0},
				{MaterialID: 2, Quantity: 3, Price: 15.0},
			},
			expected: 65.0,
		},
		{
			name:     "Empty items",
			items:    []OrderItemInput{},
			expected: 0.0,
		},
		{
			name: "Decimal prices",
			items: []OrderItemInput{
				{MaterialID: 1, Quantity: 1, Price: 10.50},
				{MaterialID: 2, Quantity: 2, Price: 5.25},
			},
			expected: 21.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := CalculateOrderAmount(tt.items)
			if result != tt.expected {
				t.Errorf("CalculateOrderAmount() = %v, expected %v", result, tt.expected)
			}
		})
	}
}

func TestGenerateOrderNo(t *testing.T) {
	orderNo1 := GenerateOrderNo()
	orderNo2 := GenerateOrderNo()

	// Check format: ORD + YYYYMMDD + random
	if len(orderNo1) < 11 {
		t.Errorf("Order number too short: %s", orderNo1)
	}

	if orderNo1[:3] != "ORD" {
		t.Errorf("Order number should start with 'ORD', got: %s", orderNo1[:3])
	}

	// Check uniqueness
	if orderNo1 == orderNo2 {
		t.Error("Generated order numbers should be unique")
	}
}

func TestValidateOrderStatus(t *testing.T) {
	validStatuses := []string{"pending", "confirmed", "shipping", "completed", "cancelled"}
	invalidStatuses := []string{"invalid", "", "PENDING", "Confirmed"}

	for _, status := range validStatuses {
		if !ValidateOrderStatus(status) {
			t.Errorf("ValidateOrderStatus(%s) should return true", status)
		}
	}

	for _, status := range invalidStatuses {
		if ValidateOrderStatus(status) {
			t.Errorf("ValidateOrderStatus(%s) should return false", status)
		}
	}
}

func TestCanTransitionOrderStatus(t *testing.T) {
	tests := []struct {
		from     string
		to       string
		expected bool
	}{
		{"pending", "confirmed", true},
		{"pending", "cancelled", true},
		{"confirmed", "shipping", true},
		{"shipping", "completed", true},
		{"pending", "completed", false},
		{"completed", "pending", false},
		{"cancelled", "confirmed", false},
	}

	for _, tt := range tests {
		t.Run(tt.from+"->"+tt.to, func(t *testing.T) {
			result := CanTransitionOrderStatus(tt.from, tt.to)
			if result != tt.expected {
				t.Errorf("CanTransitionOrderStatus(%s, %s) = %v, expected %v",
					tt.from, tt.to, result, tt.expected)
			}
		})
	}
}

// OrderItemInput for testing
type OrderItemInput struct {
	MaterialID uint
	Quantity   int
	Price      float64
}

// Mock functions for testing
func CalculateOrderAmount(items []OrderItemInput) float64 {
	var total float64
	for _, item := range items {
		total += float64(item.Quantity) * item.Price
	}
	return total
}

func GenerateOrderNo() string {
	now := time.Now()
	return "ORD" + now.Format("20060102") + randomString(6)
}

func ValidateOrderStatus(status string) bool {
	validStatuses := map[string]bool{
		"pending":   true,
		"confirmed": true,
		"shipping":  true,
		"completed": true,
		"cancelled": true,
	}
	return validStatuses[status]
}

func CanTransitionOrderStatus(from, to string) bool {
	transitions := map[string][]string{
		"pending":   {"confirmed", "cancelled"},
		"confirmed": {"shipping", "cancelled"},
		"shipping":  {"completed"},
		"completed": {},
		"cancelled": {},
	}

	allowedTransitions, exists := transitions[from]
	if !exists {
		return false
	}

	for _, allowed := range allowedTransitions {
		if allowed == to {
			return true
		}
	}
	return false
}

func randomString(n int) string {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	result := make([]byte, n)
	for i := range result {
		result[i] = letters[time.Now().UnixNano()%int64(len(letters))]
	}
	return string(result)
}

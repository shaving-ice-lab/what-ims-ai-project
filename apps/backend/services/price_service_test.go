package services

import (
	"math"
	"testing"
)

func TestCalculateMarkupPrice(t *testing.T) {
	tests := []struct {
		name       string
		basePrice  float64
		markupRate float64
		expected   float64
	}{
		{
			name:       "10% markup",
			basePrice:  100.0,
			markupRate: 0.10,
			expected:   110.0,
		},
		{
			name:       "25% markup",
			basePrice:  80.0,
			markupRate: 0.25,
			expected:   100.0,
		},
		{
			name:       "No markup",
			basePrice:  50.0,
			markupRate: 0.0,
			expected:   50.0,
		},
		{
			name:       "Decimal prices",
			basePrice:  10.50,
			markupRate: 0.20,
			expected:   12.60,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := CalculateMarkupPrice(tt.basePrice, tt.markupRate)
			if math.Abs(result-tt.expected) > 0.001 {
				t.Errorf("CalculateMarkupPrice(%v, %v) = %v, expected %v",
					tt.basePrice, tt.markupRate, result, tt.expected)
			}
		})
	}
}

func TestCalculateFixedMarkupPrice(t *testing.T) {
	tests := []struct {
		name        string
		basePrice   float64
		fixedMarkup float64
		expected    float64
	}{
		{
			name:        "Fixed 5 yuan markup",
			basePrice:   100.0,
			fixedMarkup: 5.0,
			expected:    105.0,
		},
		{
			name:        "Fixed 10 yuan markup",
			basePrice:   50.0,
			fixedMarkup: 10.0,
			expected:    60.0,
		},
		{
			name:        "No markup",
			basePrice:   100.0,
			fixedMarkup: 0.0,
			expected:    100.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := CalculateFixedMarkupPrice(tt.basePrice, tt.fixedMarkup)
			if math.Abs(result-tt.expected) > 0.001 {
				t.Errorf("CalculateFixedMarkupPrice(%v, %v) = %v, expected %v",
					tt.basePrice, tt.fixedMarkup, result, tt.expected)
			}
		})
	}
}

func TestRoundPrice(t *testing.T) {
	tests := []struct {
		name     string
		price    float64
		decimals int
		expected float64
	}{
		{
			name:     "Round to 2 decimals",
			price:    10.556,
			decimals: 2,
			expected: 10.56,
		},
		{
			name:     "Round down",
			price:    10.554,
			decimals: 2,
			expected: 10.55,
		},
		{
			name:     "Round to integer",
			price:    10.5,
			decimals: 0,
			expected: 11.0,
		},
		{
			name:     "Already rounded",
			price:    10.50,
			decimals: 2,
			expected: 10.50,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := RoundPrice(tt.price, tt.decimals)
			if math.Abs(result-tt.expected) > 0.001 {
				t.Errorf("RoundPrice(%v, %v) = %v, expected %v",
					tt.price, tt.decimals, result, tt.expected)
			}
		})
	}
}

func TestValidatePriceRange(t *testing.T) {
	tests := []struct {
		name     string
		price    float64
		min      float64
		max      float64
		expected bool
	}{
		{
			name:     "Price within range",
			price:    50.0,
			min:      10.0,
			max:      100.0,
			expected: true,
		},
		{
			name:     "Price at minimum",
			price:    10.0,
			min:      10.0,
			max:      100.0,
			expected: true,
		},
		{
			name:     "Price at maximum",
			price:    100.0,
			min:      10.0,
			max:      100.0,
			expected: true,
		},
		{
			name:     "Price below minimum",
			price:    5.0,
			min:      10.0,
			max:      100.0,
			expected: false,
		},
		{
			name:     "Price above maximum",
			price:    150.0,
			min:      10.0,
			max:      100.0,
			expected: false,
		},
		{
			name:     "Negative price",
			price:    -10.0,
			min:      0.0,
			max:      100.0,
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ValidatePriceRange(tt.price, tt.min, tt.max)
			if result != tt.expected {
				t.Errorf("ValidatePriceRange(%v, %v, %v) = %v, expected %v",
					tt.price, tt.min, tt.max, result, tt.expected)
			}
		})
	}
}

// Mock functions for testing
func CalculateMarkupPrice(basePrice, markupRate float64) float64 {
	return basePrice * (1 + markupRate)
}

func CalculateFixedMarkupPrice(basePrice, fixedMarkup float64) float64 {
	return basePrice + fixedMarkup
}

func RoundPrice(price float64, decimals int) float64 {
	multiplier := math.Pow(10, float64(decimals))
	return math.Round(price*multiplier) / multiplier
}

func ValidatePriceRange(price, min, max float64) bool {
	return price >= min && price <= max
}

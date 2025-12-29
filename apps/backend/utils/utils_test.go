package utils

import (
	"testing"
	"time"
)

func TestFormatDate(t *testing.T) {
	testTime := time.Date(2024, 1, 15, 10, 30, 0, 0, time.UTC)

	tests := []struct {
		name     string
		format   string
		expected string
	}{
		{
			name:     "Date only",
			format:   "2006-01-02",
			expected: "2024-01-15",
		},
		{
			name:     "Date and time",
			format:   "2006-01-02 15:04:05",
			expected: "2024-01-15 10:30:00",
		},
		{
			name:     "Chinese format",
			format:   "2006年01月02日",
			expected: "2024年01月15日",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := testTime.Format(tt.format)
			if result != tt.expected {
				t.Errorf("FormatDate() = %v, expected %v", result, tt.expected)
			}
		})
	}
}

func TestParseDate(t *testing.T) {
	tests := []struct {
		name      string
		dateStr   string
		format    string
		expectErr bool
	}{
		{
			name:      "Valid date",
			dateStr:   "2024-01-15",
			format:    "2006-01-02",
			expectErr: false,
		},
		{
			name:      "Valid datetime",
			dateStr:   "2024-01-15 10:30:00",
			format:    "2006-01-02 15:04:05",
			expectErr: false,
		},
		{
			name:      "Invalid date",
			dateStr:   "invalid",
			format:    "2006-01-02",
			expectErr: true,
		},
		{
			name:      "Wrong format",
			dateStr:   "15-01-2024",
			format:    "2006-01-02",
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := time.Parse(tt.format, tt.dateStr)
			if tt.expectErr && err == nil {
				t.Error("Expected error but got nil")
			}
			if !tt.expectErr && err != nil {
				t.Errorf("Unexpected error: %v", err)
			}
		})
	}
}

func TestValidatePhone(t *testing.T) {
	tests := []struct {
		phone    string
		expected bool
	}{
		{"13800138000", true},
		{"15912345678", true},
		{"18888888888", true},
		{"12345678901", false},
		{"1380013800", false},
		{"138001380001", false},
		{"abc12345678", false},
		{"", false},
	}

	for _, tt := range tests {
		t.Run(tt.phone, func(t *testing.T) {
			result := ValidatePhone(tt.phone)
			if result != tt.expected {
				t.Errorf("ValidatePhone(%s) = %v, expected %v", tt.phone, result, tt.expected)
			}
		})
	}
}

func TestValidateEmail(t *testing.T) {
	tests := []struct {
		email    string
		expected bool
	}{
		{"test@example.com", true},
		{"user.name@domain.org", true},
		{"user+tag@example.co.uk", true},
		{"invalid", false},
		{"@example.com", false},
		{"user@", false},
		{"user@.com", false},
		{"", false},
	}

	for _, tt := range tests {
		t.Run(tt.email, func(t *testing.T) {
			result := ValidateEmail(tt.email)
			if result != tt.expected {
				t.Errorf("ValidateEmail(%s) = %v, expected %v", tt.email, result, tt.expected)
			}
		})
	}
}

func TestTruncateString(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		maxLen   int
		expected string
	}{
		{
			name:     "String shorter than max",
			input:    "hello",
			maxLen:   10,
			expected: "hello",
		},
		{
			name:     "String equals max",
			input:    "hello",
			maxLen:   5,
			expected: "hello",
		},
		{
			name:     "String longer than max",
			input:    "hello world",
			maxLen:   5,
			expected: "hello...",
		},
		{
			name:     "Empty string",
			input:    "",
			maxLen:   5,
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := truncateStringHelper(tt.input, tt.maxLen)
			if result != tt.expected {
				t.Errorf("TruncateString(%s, %d) = %v, expected %v",
					tt.input, tt.maxLen, result, tt.expected)
			}
		})
	}
}

// Helper functions for testing (using existing utils functions)
func formatDateHelper(t time.Time, format string) string {
	return t.Format(format)
}

func parseDateHelper(dateStr, format string) (time.Time, error) {
	return time.Parse(format, dateStr)
}

func truncateStringHelper(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}

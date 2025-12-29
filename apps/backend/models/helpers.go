package models

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"
)

// generateRandomDigits generates a string of random digits with specified length
func generateRandomDigits(length int) string {
	const digits = "0123456789"
	result := make([]byte, length)
	
	for i := range result {
		num, _ := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		result[i] = digits[num.Int64()]
	}
	
	return string(result)
}

// generateOrderNo generates a unique order number
func generateOrderNo() string {
	// Format: timestamp (YYYYMMDDHHmmss) + random 6 digits
	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	return timestamp + generateRandomDigits(6)
}

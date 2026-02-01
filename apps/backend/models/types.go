package models

import (
	"crypto/rand"
	"database/sql/driver"
	"encoding/hex"
	"encoding/json"
	"errors"
)

// JSONMap is a helper type for JSON object fields in GORM
type JSONMap map[string]interface{}

// Value implements the driver.Valuer interface
func (j JSONMap) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface
func (j *JSONMap) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("invalid type for JSONMap")
	}

	return json.Unmarshal(bytes, j)
}

// JSON is an alias for JSONMap for compatibility
type JSON = JSONMap

// GenerateRandomString generates a random hex string of specified length
func GenerateRandomString(length int) string {
	bytes := make([]byte, length/2+1)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)[:length]
}

// scanJSON is a helper function to scan JSON from database
func scanJSON(value interface{}, dest interface{}) error {
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("invalid type for JSON scan")
	}
	return json.Unmarshal(bytes, dest)
}

// valueJSON is a helper function to convert to JSON for database
func valueJSON(v interface{}) (driver.Value, error) {
	if v == nil {
		return nil, nil
	}
	return json.Marshal(v)
}

// JSONStringArray is a helper type for JSON string array fields
type JSONStringArray []string

// Value implements the driver.Valuer interface
func (j JSONStringArray) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface
func (j *JSONStringArray) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("invalid type for JSONStringArray")
	}

	return json.Unmarshal(bytes, j)
}

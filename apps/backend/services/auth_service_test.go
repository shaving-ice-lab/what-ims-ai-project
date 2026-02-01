package services

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword checks if a password matches a hash
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// TestClaims for JWT token
type TestClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

var testJWTSecret = []byte("test_secret_key")

// GenerateToken generates a JWT token for testing
func GenerateToken(userID uint, username, role string) (string, error) {
	claims := TestClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(testJWTSecret)
}

// ValidateToken validates a JWT token for testing
func ValidateToken(tokenString string) (*TestClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &TestClaims{}, func(token *jwt.Token) (interface{}, error) {
		return testJWTSecret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*TestClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrSignatureInvalid
}

func TestHashPassword(t *testing.T) {
	password := "testPassword123"

	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword failed: %v", err)
	}

	if hashedPassword == "" {
		t.Error("HashPassword returned empty string")
	}

	if hashedPassword == password {
		t.Error("HashPassword returned unhashed password")
	}
}

func TestCheckPassword(t *testing.T) {
	password := "testPassword123"
	wrongPassword := "wrongPassword"

	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword failed: %v", err)
	}

	// Test correct password
	if !CheckPassword(password, hashedPassword) {
		t.Error("CheckPassword failed for correct password")
	}

	// Test wrong password
	if CheckPassword(wrongPassword, hashedPassword) {
		t.Error("CheckPassword succeeded for wrong password")
	}
}

func TestGenerateToken(t *testing.T) {
	userID := uint(1)
	username := "testuser"
	role := "store"

	token, err := GenerateToken(userID, username, role)
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	if token == "" {
		t.Error("GenerateToken returned empty string")
	}
}

func TestValidateToken(t *testing.T) {
	userID := uint(1)
	username := "testuser"
	role := "store"

	token, err := GenerateToken(userID, username, role)
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	// Test valid token
	claims, err := ValidateToken(token)
	if err != nil {
		t.Fatalf("ValidateToken failed for valid token: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("Expected UserID %d, got %d", userID, claims.UserID)
	}

	if claims.Username != username {
		t.Errorf("Expected Username %s, got %s", username, claims.Username)
	}

	if claims.Role != role {
		t.Errorf("Expected Role %s, got %s", role, claims.Role)
	}

	// Test invalid token
	_, err = ValidateToken("invalid_token")
	if err == nil {
		t.Error("ValidateToken succeeded for invalid token")
	}
}

package services

import (
	"testing"
)

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

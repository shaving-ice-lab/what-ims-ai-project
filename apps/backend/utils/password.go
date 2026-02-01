package utils

import (
	"errors"
	"unicode"
)

var (
	ErrPasswordTooShort  = errors.New("密码长度至少8位")
	ErrPasswordTooLong   = errors.New("密码长度不能超过128位")
	ErrPasswordNoUpper   = errors.New("密码需包含大写字母")
	ErrPasswordNoLower   = errors.New("密码需包含小写字母")
	ErrPasswordNoNumber  = errors.New("密码需包含数字")
	ErrPasswordNoSpecial = errors.New("密码需包含特殊字符")
	ErrPasswordWeak      = errors.New("密码强度不足")
)

// PasswordPolicy 密码策略配置
type PasswordPolicy struct {
	MinLength      int  // 最小长度
	MaxLength      int  // 最大长度
	RequireUpper   bool // 需要大写字母
	RequireLower   bool // 需要小写字母
	RequireNumber  bool // 需要数字
	RequireSpecial bool // 需要特殊字符
}

// DefaultPolicy 默认密码策略
var DefaultPolicy = PasswordPolicy{
	MinLength:      8,
	MaxLength:      128,
	RequireUpper:   true,
	RequireLower:   true,
	RequireNumber:  true,
	RequireSpecial: false,
}

// StrictPolicy 严格密码策略
var StrictPolicy = PasswordPolicy{
	MinLength:      12,
	MaxLength:      128,
	RequireUpper:   true,
	RequireLower:   true,
	RequireNumber:  true,
	RequireSpecial: true,
}

// ValidatePassword 验证密码是否符合策略
func ValidatePassword(password string, policy PasswordPolicy) error {
	// 检查长度
	if len(password) < policy.MinLength {
		return ErrPasswordTooShort
	}
	if policy.MaxLength > 0 && len(password) > policy.MaxLength {
		return ErrPasswordTooLong
	}

	var hasUpper, hasLower, hasNumber, hasSpecial bool

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if policy.RequireUpper && !hasUpper {
		return ErrPasswordNoUpper
	}
	if policy.RequireLower && !hasLower {
		return ErrPasswordNoLower
	}
	if policy.RequireNumber && !hasNumber {
		return ErrPasswordNoNumber
	}
	if policy.RequireSpecial && !hasSpecial {
		return ErrPasswordNoSpecial
	}

	return nil
}

// ValidatePasswordWithDefaultPolicy 使用默认策略验证密码
func ValidatePasswordWithDefaultPolicy(password string) error {
	return ValidatePassword(password, DefaultPolicy)
}

// ValidatePasswordWithStrictPolicy 使用严格策略验证密码
func ValidatePasswordWithStrictPolicy(password string) error {
	return ValidatePassword(password, StrictPolicy)
}

// GetPasswordStrength 获取密码强度(0-4)
// 0: 非常弱, 1: 弱, 2: 中等, 3: 强, 4: 非常强
func GetPasswordStrength(password string) int {
	strength := 0

	// 长度评分
	if len(password) >= 8 {
		strength++
	}
	if len(password) >= 12 {
		strength++
	}

	var hasUpper, hasLower, hasNumber, hasSpecial bool

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	// 字符类型评分
	types := 0
	if hasUpper {
		types++
	}
	if hasLower {
		types++
	}
	if hasNumber {
		types++
	}
	if hasSpecial {
		types++
	}

	if types >= 3 {
		strength++
	}
	if types == 4 {
		strength++
	}

	// 限制最大值
	if strength > 4 {
		strength = 4
	}

	return strength
}

// IsCommonPassword 检查是否为常见弱密码
func IsCommonPassword(password string) bool {
	commonPasswords := map[string]bool{
		"password":   true,
		"12345678":   true,
		"123456789":  true,
		"1234567890": true,
		"qwerty":     true,
		"qwertyuiop": true,
		"admin":      true,
		"admin123":   true,
		"root":       true,
		"root123":    true,
		"password1":  true,
		"password123": true,
		"abc123":     true,
		"letmein":    true,
		"welcome":    true,
		"monkey":     true,
		"dragon":     true,
		"master":     true,
		"111111":     true,
		"000000":     true,
	}

	return commonPasswords[password]
}

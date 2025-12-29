package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"regexp"
	"strings"
)

// AESEncrypt AES加密
func AESEncrypt(plainText, key string) (string, error) {
	if len(key) != 16 && len(key) != 24 && len(key) != 32 {
		return "", errors.New("key length must be 16, 24, or 32 bytes")
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	plainBytes := []byte(plainText)
	cipherText := make([]byte, aes.BlockSize+len(plainBytes))
	iv := cipherText[:aes.BlockSize]

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText[aes.BlockSize:], plainBytes)

	return base64.StdEncoding.EncodeToString(cipherText), nil
}

// AESDecrypt AES解密
func AESDecrypt(cipherText, key string) (string, error) {
	if len(key) != 16 && len(key) != 24 && len(key) != 32 {
		return "", errors.New("key length must be 16, 24, or 32 bytes")
	}

	cipherBytes, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	if len(cipherBytes) < aes.BlockSize {
		return "", errors.New("ciphertext too short")
	}

	iv := cipherBytes[:aes.BlockSize]
	cipherBytes = cipherBytes[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(cipherBytes, cipherBytes)

	return string(cipherBytes), nil
}

// MaskPhone 手机号脱敏 138****8888
func MaskPhone(phone string) string {
	if len(phone) < 7 {
		return phone
	}
	return phone[:3] + "****" + phone[len(phone)-4:]
}

// MaskIDCard 身份证号脱敏 110***********1234
func MaskIDCard(idCard string) string {
	if len(idCard) < 8 {
		return idCard
	}
	return idCard[:3] + strings.Repeat("*", len(idCard)-7) + idCard[len(idCard)-4:]
}

// MaskEmail 邮箱脱敏 u***@example.com
func MaskEmail(email string) string {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return email
	}
	username := parts[0]
	if len(username) <= 1 {
		return email
	}
	return username[:1] + "***@" + parts[1]
}

// MaskAPIKey API密钥脱敏 abc1****xyz9
func MaskAPIKey(apiKey string) string {
	if len(apiKey) < 8 {
		return strings.Repeat("*", len(apiKey))
	}
	return apiKey[:4] + "****" + apiKey[len(apiKey)-4:]
}

// MaskBankCard 银行卡号脱敏 6222 **** **** 1234
func MaskBankCard(cardNo string) string {
	// 移除空格
	cardNo = strings.ReplaceAll(cardNo, " ", "")
	if len(cardNo) < 8 {
		return cardNo
	}
	return cardNo[:4] + " **** **** " + cardNo[len(cardNo)-4:]
}

// MaskName 姓名脱敏 张*三
func MaskName(name string) string {
	runes := []rune(name)
	if len(runes) <= 1 {
		return name
	}
	if len(runes) == 2 {
		return string(runes[0]) + "*"
	}
	return string(runes[0]) + "*" + string(runes[len(runes)-1])
}

// MaskAddress 地址脱敏（保留省市，隐藏详细地址）
func MaskAddress(address string) string {
	// 简单实现：保留前20个字符
	runes := []rune(address)
	if len(runes) <= 20 {
		return address
	}
	return string(runes[:20]) + "****"
}

// GenerateRandomString 生成随机字符串
func GenerateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	rand.Read(b)
	for i := range b {
		b[i] = charset[int(b[i])%len(charset)]
	}
	return string(b)
}

// GenerateAPIKey 生成API密钥
func GenerateAPIKey() string {
	return GenerateRandomString(32)
}

// GenerateAPISecret 生成API密钥
func GenerateAPISecret() string {
	return GenerateRandomString(64)
}

// ValidatePhone 验证手机号格式
func ValidatePhone(phone string) bool {
	pattern := `^1[3-9]\d{9}$`
	matched, _ := regexp.MatchString(pattern, phone)
	return matched
}

// ValidateEmail 验证邮箱格式
func ValidateEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(pattern, email)
	return matched
}

// ValidateIDCard 验证身份证号格式（简单校验）
func ValidateIDCard(idCard string) bool {
	pattern := `^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$`
	matched, _ := regexp.MatchString(pattern, idCard)
	return matched
}

// SanitizeInput 清理输入（防止XSS）
func SanitizeInput(input string) string {
	// 移除HTML标签
	re := regexp.MustCompile(`<[^>]*>`)
	cleaned := re.ReplaceAllString(input, "")

	// 转义特殊字符
	replacer := strings.NewReplacer(
		"&", "&amp;",
		"<", "&lt;",
		">", "&gt;",
		"\"", "&quot;",
		"'", "&#39;",
	)
	return replacer.Replace(cleaned)
}

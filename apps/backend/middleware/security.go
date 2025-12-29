package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

// SignatureConfig 签名验证配置
type SignatureConfig struct {
	SecretKey          string
	TimestampTolerance time.Duration // 时间戳容差
	SkipPaths          []string      // 跳过签名验证的路径
}

// DefaultSignatureConfig 默认签名配置
var DefaultSignatureConfig = SignatureConfig{
	TimestampTolerance: 5 * time.Minute,
}

// SignatureMiddleware 请求签名验证中间件
// Header: X-Signature, X-Timestamp, X-Nonce
func SignatureMiddleware(config SignatureConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 检查是否跳过
			path := c.Request().URL.Path
			for _, skip := range config.SkipPaths {
				if strings.HasPrefix(path, skip) {
					return next(c)
				}
			}

			// 获取签名相关Header
			signature := c.Request().Header.Get("X-Signature")
			timestampStr := c.Request().Header.Get("X-Timestamp")
			nonce := c.Request().Header.Get("X-Nonce")

			if signature == "" || timestampStr == "" || nonce == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "缺少签名信息",
				})
			}

			// 验证时间戳
			timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "无效的时间戳",
				})
			}

			requestTime := time.Unix(timestamp, 0)
			if time.Since(requestTime) > config.TimestampTolerance {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "请求已过期",
				})
			}

			// 读取请求体
			var bodyBytes []byte
			if c.Request().Body != nil {
				bodyBytes, _ = io.ReadAll(c.Request().Body)
				c.Request().Body = io.NopCloser(strings.NewReader(string(bodyBytes)))
			}

			// 计算签名
			signContent := fmt.Sprintf("%s%s%s", timestampStr, nonce, string(bodyBytes))
			expectedSignature := calculateHMACSHA256(signContent, config.SecretKey)

			if !hmac.Equal([]byte(signature), []byte(expectedSignature)) {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code":    401,
					"message": "签名验证失败",
				})
			}

			return next(c)
		}
	}
}

// calculateHMACSHA256 计算HMAC-SHA256签名
func calculateHMACSHA256(message, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(message))
	return hex.EncodeToString(h.Sum(nil))
}

// RateLimiterConfig 频率限制配置
type RateLimiterConfig struct {
	Rate      rate.Limit // 每秒允许的请求数
	Burst     int        // 突发请求数
	SkipPaths []string   // 跳过限制的路径
}

// DefaultRateLimiters 默认频率限制配置
var (
	// 普通接口：100次/分钟
	NormalRateLimiter = RateLimiterConfig{
		Rate:  rate.Limit(100.0 / 60.0),
		Burst: 10,
	}
	// 登录接口：10次/分钟
	LoginRateLimiter = RateLimiterConfig{
		Rate:  rate.Limit(10.0 / 60.0),
		Burst: 3,
	}
	// 验证码接口：1次/分钟
	CaptchaRateLimiter = RateLimiterConfig{
		Rate:  rate.Limit(1.0 / 60.0),
		Burst: 1,
	}
)

// IPRateLimiter IP维度的频率限制器
type IPRateLimiter struct {
	limiters map[string]*rate.Limiter
	config   RateLimiterConfig
}

// NewIPRateLimiter 创建IP频率限制器
func NewIPRateLimiter(config RateLimiterConfig) *IPRateLimiter {
	return &IPRateLimiter{
		limiters: make(map[string]*rate.Limiter),
		config:   config,
	}
}

// GetLimiter 获取指定IP的限制器
func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	limiter, exists := i.limiters[ip]
	if !exists {
		limiter = rate.NewLimiter(i.config.Rate, i.config.Burst)
		i.limiters[ip] = limiter
	}
	return limiter
}

// RateLimitMiddleware 频率限制中间件
func RateLimitMiddleware(limiter *IPRateLimiter) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ip := c.RealIP()
			if !limiter.GetLimiter(ip).Allow() {
				return c.JSON(http.StatusTooManyRequests, map[string]interface{}{
					"code":    429,
					"message": "请求过于频繁，请稍后再试",
				})
			}
			return next(c)
		}
	}
}

// XSSMiddleware XSS防护中间件（设置安全响应头）
func XSSMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("X-XSS-Protection", "1; mode=block")
			c.Response().Header().Set("X-Content-Type-Options", "nosniff")
			c.Response().Header().Set("X-Frame-Options", "DENY")
			c.Response().Header().Set("Content-Security-Policy", "default-src 'self'")
			return next(c)
		}
	}
}

// CSRFConfig CSRF防护配置
type CSRFConfig struct {
	TokenLookup    string
	CookieName     string
	CookieSameSite http.SameSite
	CookieSecure   bool
	CookieHTTPOnly bool
}

// DefaultCSRFConfig 默认CSRF配置
var DefaultCSRFConfig = CSRFConfig{
	TokenLookup:    "header:X-CSRF-Token",
	CookieName:     "_csrf",
	CookieSameSite: http.SameSiteStrictMode,
	CookieSecure:   true,
	CookieHTTPOnly: true,
}

// CSRFMiddleware CSRF防护中间件
func CSRFMiddleware(config CSRFConfig) echo.MiddlewareFunc {
	return middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup:    config.TokenLookup,
		CookieName:     config.CookieName,
		CookieSameSite: config.CookieSameSite,
		CookieSecure:   config.CookieSecure,
		CookieHTTPOnly: config.CookieHTTPOnly,
	})
}

// SecureMiddleware 综合安全中间件
func SecureMiddleware() echo.MiddlewareFunc {
	return middleware.SecureWithConfig(middleware.SecureConfig{
		XSSProtection:         "1; mode=block",
		ContentTypeNosniff:    "nosniff",
		XFrameOptions:         "DENY",
		HSTSMaxAge:            31536000,
		ContentSecurityPolicy: "default-src 'self'",
	})
}

// CORSMiddleware CORS跨域中间件
func CORSMiddleware(allowOrigins []string) echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization, "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           86400,
	})
}

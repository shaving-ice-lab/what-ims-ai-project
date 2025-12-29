package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

// PaymentService 支付服务
type PaymentService struct {
	db *gorm.DB
}

// NewPaymentService 创建支付服务
func NewPaymentService(db *gorm.DB) *PaymentService {
	return &PaymentService{db: db}
}

// PaymentStatus 支付状态
type PaymentStatus string

const (
	PaymentStatusPending       PaymentStatus = "pending"
	PaymentStatusSuccess       PaymentStatus = "success"
	PaymentStatusFailed        PaymentStatus = "failed"
	PaymentStatusRefunded      PaymentStatus = "refunded"
	PaymentStatusPartialRefund PaymentStatus = "partial_refund"
)

// PaymentMethod 支付方式
type PaymentMethod string

const (
	PaymentMethodWechat PaymentMethod = "wechat"
	PaymentMethodAlipay PaymentMethod = "alipay"
)

// PaymentRecord 支付记录模型
type PaymentRecord struct {
	ID               uint64        `gorm:"primaryKey" json:"id"`
	OrderID          uint64        `gorm:"not null;index" json:"orderId"`
	OrderNo          string        `gorm:"type:varchar(30);not null" json:"orderNo"`
	PaymentNo        string        `gorm:"type:varchar(50);uniqueIndex;not null" json:"paymentNo"`
	PaymentMethod    PaymentMethod `gorm:"type:varchar(20);not null" json:"paymentMethod"`
	GoodsAmount      float64       `gorm:"type:decimal(10,2);not null" json:"goodsAmount"`
	ServiceFee       float64       `gorm:"type:decimal(10,2);default:0" json:"serviceFee"`
	Amount           float64       `gorm:"type:decimal(10,2);not null" json:"amount"`
	Status           PaymentStatus `gorm:"type:varchar(20);default:pending;index" json:"status"`
	QRCodeURL        string        `gorm:"type:varchar(500)" json:"qrcodeUrl"`
	QRCodeExpireTime *time.Time    `json:"qrcodeExpireTime"`
	TradeNo          string        `gorm:"type:varchar(100);index" json:"tradeNo"`
	PayTime          *time.Time    `json:"payTime"`
	CallbackData     string        `gorm:"type:text" json:"callbackData"`
	RefundNo         string        `gorm:"type:varchar(50)" json:"refundNo"`
	RefundAmount     float64       `gorm:"type:decimal(10,2)" json:"refundAmount"`
	RefundTime       *time.Time    `json:"refundTime"`
	RefundReason     string        `gorm:"type:varchar(200)" json:"refundReason"`
	ErrorMsg         string        `gorm:"type:varchar(500)" json:"errorMsg"`
	CreatedAt        time.Time     `gorm:"index" json:"createdAt"`
	UpdatedAt        time.Time     `json:"updatedAt"`
}

// TableName 表名
func (PaymentRecord) TableName() string {
	return "payment_records"
}

// CreatePaymentRequest 创建支付请求
type CreatePaymentRequest struct {
	OrderID       uint64        `json:"orderId" validate:"required"`
	OrderNo       string        `json:"orderNo" validate:"required"`
	GoodsAmount   float64       `json:"goodsAmount" validate:"required,gt=0"`
	ServiceFee    float64       `json:"serviceFee" validate:"gte=0"`
	Amount        float64       `json:"amount" validate:"required,gt=0"`
	PaymentMethod PaymentMethod `json:"paymentMethod" validate:"required,oneof=wechat alipay"`
}

// PaymentQRCodeResponse 支付二维码响应
type PaymentQRCodeResponse struct {
	PaymentNo   string    `json:"paymentNo"`
	QRCodeURL   string    `json:"qrcodeUrl"`
	ExpireTime  time.Time `json:"expireTime"`
	ExpireIn    int       `json:"expireIn"` // 秒数
	Amount      float64   `json:"amount"`
	OrderNo     string    `json:"orderNo"`
}

// PaymentStatusResponse 支付状态响应
type PaymentStatusResponse struct {
	PaymentNo string        `json:"paymentNo"`
	OrderNo   string        `json:"orderNo"`
	Status    PaymentStatus `json:"status"`
	Amount    float64       `json:"amount"`
	PayTime   *time.Time    `json:"payTime,omitempty"`
	TradeNo   string        `json:"tradeNo,omitempty"`
}

// CreatePayment 创建支付订单并生成二维码
func (s *PaymentService) CreatePayment(req *CreatePaymentRequest) (*PaymentQRCodeResponse, error) {
	// 生成支付流水号
	paymentNo := generatePaymentNo()

	// 设置二维码过期时间（15分钟）
	expireTime := time.Now().Add(15 * time.Minute)

	// 生成模拟二维码URL（实际项目中应调用微信/支付宝接口）
	qrcodeURL := fmt.Sprintf("https://pay.example.com/qrcode/%s?method=%s&amount=%.2f",
		paymentNo, req.PaymentMethod, req.Amount)

	// 创建支付记录
	record := &PaymentRecord{
		OrderID:          req.OrderID,
		OrderNo:          req.OrderNo,
		PaymentNo:        paymentNo,
		PaymentMethod:    req.PaymentMethod,
		GoodsAmount:      req.GoodsAmount,
		ServiceFee:       req.ServiceFee,
		Amount:           req.Amount,
		Status:           PaymentStatusPending,
		QRCodeURL:        qrcodeURL,
		QRCodeExpireTime: &expireTime,
	}

	if err := s.db.Create(record).Error; err != nil {
		return nil, err
	}

	return &PaymentQRCodeResponse{
		PaymentNo:  paymentNo,
		QRCodeURL:  qrcodeURL,
		ExpireTime: expireTime,
		ExpireIn:   15 * 60,
		Amount:     req.Amount,
		OrderNo:    req.OrderNo,
	}, nil
}

// RefreshQRCode 刷新支付二维码
func (s *PaymentService) RefreshQRCode(paymentNo string) (*PaymentQRCodeResponse, error) {
	var record PaymentRecord
	if err := s.db.Where("payment_no = ?", paymentNo).First(&record).Error; err != nil {
		return nil, err
	}

	if record.Status != PaymentStatusPending {
		return nil, errors.New("支付状态已变更，无法刷新二维码")
	}

	// 更新过期时间
	expireTime := time.Now().Add(15 * time.Minute)
	qrcodeURL := fmt.Sprintf("https://pay.example.com/qrcode/%s?method=%s&amount=%.2f&t=%d",
		paymentNo, record.PaymentMethod, record.Amount, time.Now().Unix())

	if err := s.db.Model(&record).Updates(map[string]interface{}{
		"qrcode_url":         qrcodeURL,
		"qrcode_expire_time": expireTime,
	}).Error; err != nil {
		return nil, err
	}

	return &PaymentQRCodeResponse{
		PaymentNo:  paymentNo,
		QRCodeURL:  qrcodeURL,
		ExpireTime: expireTime,
		ExpireIn:   15 * 60,
		Amount:     record.Amount,
		OrderNo:    record.OrderNo,
	}, nil
}

// SwitchPaymentMethod 切换支付方式
func (s *PaymentService) SwitchPaymentMethod(paymentNo string, newMethod PaymentMethod) (*PaymentQRCodeResponse, error) {
	var record PaymentRecord
	if err := s.db.Where("payment_no = ?", paymentNo).First(&record).Error; err != nil {
		return nil, err
	}

	if record.Status != PaymentStatusPending {
		return nil, errors.New("支付状态已变更，无法切换支付方式")
	}

	// 更新支付方式和二维码
	expireTime := time.Now().Add(15 * time.Minute)
	qrcodeURL := fmt.Sprintf("https://pay.example.com/qrcode/%s?method=%s&amount=%.2f&t=%d",
		paymentNo, newMethod, record.Amount, time.Now().Unix())

	if err := s.db.Model(&record).Updates(map[string]interface{}{
		"payment_method":     newMethod,
		"qrcode_url":         qrcodeURL,
		"qrcode_expire_time": expireTime,
	}).Error; err != nil {
		return nil, err
	}

	return &PaymentQRCodeResponse{
		PaymentNo:  paymentNo,
		QRCodeURL:  qrcodeURL,
		ExpireTime: expireTime,
		ExpireIn:   15 * 60,
		Amount:     record.Amount,
		OrderNo:    record.OrderNo,
	}, nil
}

// GetPaymentStatus 查询支付状态
func (s *PaymentService) GetPaymentStatus(paymentNo string) (*PaymentStatusResponse, error) {
	var record PaymentRecord
	if err := s.db.Where("payment_no = ?", paymentNo).First(&record).Error; err != nil {
		return nil, err
	}

	// 检查是否已过期
	if record.Status == PaymentStatusPending && record.QRCodeExpireTime != nil {
		if time.Now().After(*record.QRCodeExpireTime) {
			// 标记为已过期（失败）
			s.db.Model(&record).Update("status", PaymentStatusFailed)
			record.Status = PaymentStatusFailed
		}
	}

	return &PaymentStatusResponse{
		PaymentNo: record.PaymentNo,
		OrderNo:   record.OrderNo,
		Status:    record.Status,
		Amount:    record.Amount,
		PayTime:   record.PayTime,
		TradeNo:   record.TradeNo,
	}, nil
}

// GetPaymentByOrderID 根据订单ID获取支付记录
func (s *PaymentService) GetPaymentByOrderID(orderID uint64) (*PaymentRecord, error) {
	var record PaymentRecord
	err := s.db.Where("order_id = ?", orderID).Order("created_at DESC").First(&record).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

// HandlePaymentCallback 处理支付回调
func (s *PaymentService) HandlePaymentCallback(paymentNo string, tradeNo string, callbackData string) error {
	var record PaymentRecord
	if err := s.db.Where("payment_no = ?", paymentNo).First(&record).Error; err != nil {
		return err
	}

	if record.Status != PaymentStatusPending {
		return errors.New("支付状态已变更")
	}

	now := time.Now()
	return s.db.Model(&record).Updates(map[string]interface{}{
		"status":        PaymentStatusSuccess,
		"trade_no":      tradeNo,
		"pay_time":      now,
		"callback_data": callbackData,
	}).Error
}

// generatePaymentNo 生成支付流水号
func generatePaymentNo() string {
	b := make([]byte, 8)
	rand.Read(b)
	return "PAY" + time.Now().Format("20060102150405") + hex.EncodeToString(b)[:6]
}

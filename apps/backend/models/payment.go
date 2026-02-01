package models

import (
	"time"

	"gorm.io/gorm"
)

// PaymentStatus and PaymentMethod are defined in order.go

// Additional payment-specific status constants
const (
	PaymentRecordStatusPending PaymentStatus = "pending"
	PaymentRecordStatusSuccess PaymentStatus = "success"
	PaymentRecordStatusFailed  PaymentStatus = "failed"
)

// PaymentRecord 支付记录表
type PaymentRecord struct {
	ID               uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID          uint64         `gorm:"not null;index:idx_order_id" json:"orderId"`
	OrderNo          string         `gorm:"type:varchar(30);not null" json:"orderNo"`
	PaymentNo        string         `gorm:"type:varchar(50);uniqueIndex:uk_payment_no;not null" json:"paymentNo"`
	PaymentMethod    PaymentMethod  `gorm:"type:enum('wechat','alipay');not null" json:"paymentMethod"`
	GoodsAmount      float64        `gorm:"type:decimal(10,2);not null" json:"goodsAmount"`
	ServiceFee       float64        `gorm:"type:decimal(10,2);default:0" json:"serviceFee"`
	Amount           float64        `gorm:"type:decimal(10,2);not null" json:"amount"`
	Status           PaymentStatus  `gorm:"type:enum('pending','success','failed','refunded','partial_refund');default:'pending';index:idx_status" json:"status"`
	QRCodeURL        string         `gorm:"type:varchar(500)" json:"qrcodeUrl,omitempty"`
	QRCodeExpireTime *time.Time     `json:"qrcodeExpireTime,omitempty"`
	TradeNo          string         `gorm:"type:varchar(100);index:idx_trade_no" json:"tradeNo,omitempty"`
	PayTime          *time.Time     `json:"payTime,omitempty"`
	CallbackData     JSON           `gorm:"type:json" json:"callbackData,omitempty"`
	RefundNo         string         `gorm:"type:varchar(50)" json:"refundNo,omitempty"`
	RefundAmount     float64        `gorm:"type:decimal(10,2)" json:"refundAmount,omitempty"`
	RefundTime       *time.Time     `json:"refundTime,omitempty"`
	RefundReason     string         `gorm:"type:varchar(200)" json:"refundReason,omitempty"`
	ErrorMsg         string         `gorm:"type:varchar(500)" json:"errorMsg,omitempty"`
	CreatedAt        time.Time      `gorm:"index:idx_created_at" json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`

	// 关联
	Order *Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

// TableName 表名
func (PaymentRecord) TableName() string {
	return "payment_records"
}

// BeforeCreate 创建前生成支付流水号
func (p *PaymentRecord) BeforeCreate(tx *gorm.DB) error {
	if p.PaymentNo == "" {
		p.PaymentNo = GeneratePaymentNo()
	}
	return nil
}

// GeneratePaymentNo 生成支付流水号
func GeneratePaymentNo() string {
	return "PAY" + time.Now().Format("20060102150405") + GenerateRandomString(6)
}

package models

import (
	"time"

	"gorm.io/gorm"
)

// OrderStatus represents order status types
type OrderStatus string

const (
	OrderStatusPendingPayment OrderStatus = "pending_payment"
	OrderStatusUnpaid         OrderStatus = "pending_payment" // Alias for pending_payment
	OrderStatusPendingConfirm OrderStatus = "pending_confirm"
	OrderStatusConfirmed      OrderStatus = "confirmed"
	OrderStatusDelivering     OrderStatus = "delivering"
	OrderStatusCompleted      OrderStatus = "completed"
	OrderStatusCancelled      OrderStatus = "cancelled"
)

// PaymentStatus represents payment status types
type PaymentStatus string

const (
	PaymentStatusUnpaid        PaymentStatus = "unpaid"
	PaymentStatusPaid          PaymentStatus = "paid"
	PaymentStatusRefunded      PaymentStatus = "refunded"
	PaymentStatusPartialRefund PaymentStatus = "partial_refund"
)

// PaymentMethod represents payment method types
type PaymentMethod string

const (
	PaymentMethodWechat PaymentMethod = "wechat"
	PaymentMethodAlipay PaymentMethod = "alipay"
)

// OrderSource represents order source types
type OrderSource string

const (
	OrderSourceApp OrderSource = "app"
	OrderSourceWeb OrderSource = "web"
	OrderSourceH5  OrderSource = "h5"
)

// CancelledByType represents who cancelled the order
type CancelledByType string

const (
	CancelledByStore    CancelledByType = "store"
	CancelledBySupplier CancelledByType = "supplier"
	CancelledByAdmin    CancelledByType = "admin"
	CancelledBySystem   CancelledByType = "system"
)

// Order represents the orders table
type Order struct {
	ID                   uint64           `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderNo              string           `gorm:"type:varchar(30);uniqueIndex;not null" json:"order_no"`
	StoreID              uint64           `gorm:"index;not null" json:"store_id"`
	SupplierID           uint64           `gorm:"index;not null" json:"supplier_id"`
	GoodsAmount          float64          `gorm:"type:decimal(10,2);not null" json:"goods_amount"`
	ServiceFee           float64          `gorm:"type:decimal(10,2);default:0" json:"service_fee"`
	TotalAmount          float64          `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	SupplierAmount       float64          `gorm:"type:decimal(10,2)" json:"supplier_amount"`
	MarkupTotal          float64          `gorm:"type:decimal(10,2);default:0" json:"markup_total"`
	ItemCount            int              `json:"item_count"`
	Status               OrderStatus      `gorm:"type:enum('pending_payment','pending_confirm','confirmed','delivering','completed','cancelled')" json:"status"`
	PaymentStatus        PaymentStatus    `gorm:"type:enum('unpaid','paid','refunded','partial_refund');default:'unpaid'" json:"payment_status"`
	PaymentMethod        *PaymentMethod   `gorm:"type:enum('wechat','alipay')" json:"payment_method,omitempty"`
	PaymentTime          *time.Time       `json:"payment_time,omitempty"`
	PaymentNo            *string          `gorm:"type:varchar(50)" json:"payment_no,omitempty"`
	OrderSource          OrderSource      `gorm:"type:enum('app','web','h5')" json:"order_source"`
	DeliveryProvince     *string          `gorm:"type:varchar(50)" json:"delivery_province,omitempty"`
	DeliveryCity         *string          `gorm:"type:varchar(50)" json:"delivery_city,omitempty"`
	DeliveryDistrict     *string          `gorm:"type:varchar(50)" json:"delivery_district,omitempty"`
	DeliveryAddress      *string          `gorm:"type:varchar(200)" json:"delivery_address,omitempty"`
	DeliveryContact      *string          `gorm:"type:varchar(50)" json:"delivery_contact,omitempty"`
	DeliveryPhone        *string          `gorm:"type:varchar(20)" json:"delivery_phone,omitempty"`
	ExpectedDeliveryDate *time.Time       `gorm:"type:date" json:"expected_delivery_date,omitempty"`
	ActualDeliveryTime   *time.Time       `json:"actual_delivery_time,omitempty"`
	Remark               *string          `gorm:"type:varchar(500)" json:"remark,omitempty"`
	SupplierRemark       *string          `gorm:"type:varchar(500)" json:"supplier_remark,omitempty"`
	CancelReason         *string          `gorm:"type:varchar(200)" json:"cancel_reason,omitempty"`
	CancelledBy          *CancelledByType `gorm:"type:enum('store','supplier','admin','system')" json:"cancelled_by,omitempty"`
	CancelledByID        *uint64          `json:"cancelled_by_id,omitempty"`
	CancelledAt          *time.Time       `json:"cancelled_at,omitempty"`
	RestoredAt           *time.Time       `json:"restored_at,omitempty"`
	ConfirmedAt          *time.Time       `json:"confirmed_at,omitempty"`
	DeliveringAt         *time.Time       `json:"delivering_at,omitempty"`
	CompletedAt          *time.Time       `json:"completed_at,omitempty"`
	CreatedAt            time.Time        `json:"created_at"`
	UpdatedAt            time.Time        `json:"updated_at"`
	DeletedAt            gorm.DeletedAt   `gorm:"index" json:"-"`

	// Relationships
	Store      *Store       `gorm:"foreignKey:StoreID" json:"store,omitempty"`
	Supplier   *Supplier    `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	OrderItems []*OrderItem `gorm:"foreignKey:OrderID" json:"order_items,omitempty"`
}

// TableName specifies the table name for Order
func (Order) TableName() string {
	return "orders"
}

// BeforeCreate hook to generate order number
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.OrderNo == "" {
		o.OrderNo = generateOrderNo()
	}
	if o.Status == "" {
		o.Status = OrderStatusPendingPayment
	}
	if o.PaymentStatus == "" {
		o.PaymentStatus = PaymentStatusUnpaid
	}
	return nil
}

// CanCancel checks if the order can be cancelled
func (o *Order) CanCancel(userType string) bool {
	// System and admin can cancel any order
	if userType == "admin" || userType == "system" {
		return o.Status != OrderStatusCancelled && o.Status != OrderStatusCompleted
	}

	// Store can cancel within 1 hour if order is pending confirm
	if userType == "store" {
		if o.Status == OrderStatusPendingConfirm {
			timeSinceCreated := time.Since(o.CreatedAt)
			return timeSinceCreated.Hours() <= 1
		}
	}

	// Supplier can cancel before delivering
	if userType == "supplier" {
		return o.Status == OrderStatusPendingConfirm || o.Status == OrderStatusConfirmed
	}

	return false
}

// IsActive checks if the order is active (not cancelled)
func (o *Order) IsActive() bool {
	return o.Status != OrderStatusCancelled
}

// IsPaid checks if the order is paid
func (o *Order) IsPaid() bool {
	return o.PaymentStatus == PaymentStatusPaid
}

// NeedsPayment checks if the order needs payment
func (o *Order) NeedsPayment() bool {
	return o.Status == OrderStatusPendingPayment && o.PaymentStatus == PaymentStatusUnpaid
}

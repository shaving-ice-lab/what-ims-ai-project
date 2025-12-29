package types

import "time"

// OrderStatus 订单状态枚举
type OrderStatus string

const (
	OrderPendingPayment OrderStatus = "pending_payment"
	OrderPendingConfirm OrderStatus = "pending_confirm"
	OrderConfirmed      OrderStatus = "confirmed"
	OrderDelivering     OrderStatus = "delivering"
	OrderCompleted      OrderStatus = "completed"
	OrderCancelled      OrderStatus = "cancelled"
)

// PaymentStatus 支付状态枚举
type PaymentStatus string

const (
	PaymentUnpaid   PaymentStatus = "unpaid"
	PaymentPaid     PaymentStatus = "paid"
	PaymentRefunded PaymentStatus = "refunded"
)

// PaymentMethod 支付方式枚举
type PaymentMethod string

const (
	PaymentWechat PaymentMethod = "wechat"
	PaymentAlipay PaymentMethod = "alipay"
)

// OrderSource 订单来源枚举
type OrderSource string

const (
	SourceApp OrderSource = "app"
	SourceWeb OrderSource = "web"
	SourceH5  OrderSource = "h5"
)

// OrderInfo 订单信息
type OrderInfo struct {
	ID                   uint64        `json:"id"`
	OrderNo              string        `json:"orderNo"`
	StoreID              uint64        `json:"storeId"`
	SupplierID           uint64        `json:"supplierId"`
	GoodsAmount          float64       `json:"goodsAmount"`
	ServiceFee           float64       `json:"serviceFee"`
	TotalAmount          float64       `json:"totalAmount"`
	SupplierAmount       float64       `json:"supplierAmount"`
	MarkupTotal          float64       `json:"markupTotal"`
	ItemCount            int           `json:"itemCount"`
	Status               OrderStatus   `json:"status"`
	PaymentStatus        PaymentStatus `json:"paymentStatus"`
	PaymentMethod        PaymentMethod `json:"paymentMethod,omitempty"`
	PaymentTime          *time.Time    `json:"paymentTime,omitempty"`
	PaymentNo            string        `json:"paymentNo,omitempty"`
	OrderSource          OrderSource   `json:"orderSource"`
	DeliveryProvince     string        `json:"deliveryProvince"`
	DeliveryCity         string        `json:"deliveryCity"`
	DeliveryDistrict     string        `json:"deliveryDistrict"`
	DeliveryAddress      string        `json:"deliveryAddress"`
	DeliveryContact      string        `json:"deliveryContact"`
	DeliveryPhone        string        `json:"deliveryPhone"`
	ExpectedDeliveryDate *time.Time    `json:"expectedDeliveryDate,omitempty"`
	ActualDeliveryTime   *time.Time    `json:"actualDeliveryTime,omitempty"`
	Remark               string        `json:"remark,omitempty"`
	CreatedAt            time.Time     `json:"createdAt"`
	UpdatedAt            time.Time     `json:"updatedAt"`
	Items                []OrderItem   `json:"items,omitempty"`
	Store                *StoreInfo    `json:"store,omitempty"`
	Supplier             *SupplierInfo `json:"supplier,omitempty"`
}

// OrderItem 订单明细
type OrderItem struct {
	ID             uint64  `json:"id"`
	OrderID        uint64  `json:"orderId"`
	MaterialSkuID  uint64  `json:"materialSkuId"`
	MaterialName   string  `json:"materialName"`
	Brand          string  `json:"brand"`
	Spec           string  `json:"spec"`
	Unit           string  `json:"unit"`
	ImageURL       string  `json:"imageUrl,omitempty"`
	OriginalPrice  float64 `json:"originalPrice"`
	MarkupAmount   float64 `json:"markupAmount"`
	FinalPrice     float64 `json:"finalPrice"`
	Quantity       int     `json:"quantity"`
	TotalAmount    float64 `json:"totalAmount"`
	SupplierAmount float64 `json:"supplierAmount"`
	Remark         string  `json:"remark,omitempty"`
}

// CreateOrderRequest 创建订单请求
type CreateOrderRequest struct {
	SupplierID           uint64             `json:"supplierId" validate:"required"`
	ExpectedDeliveryDate string             `json:"expectedDeliveryDate" validate:"required"`
	Remark               string             `json:"remark"`
	Items                []CreateOrderItem  `json:"items" validate:"required,min=1,dive"`
}

// CreateOrderItem 创建订单商品项
type CreateOrderItem struct {
	MaterialSkuID uint64 `json:"materialSkuId" validate:"required"`
	Quantity      int    `json:"quantity" validate:"required,min=1"`
	Remark        string `json:"remark"`
}

// UpdateOrderRequest 更新订单请求
type UpdateOrderRequest struct {
	ExpectedDeliveryDate string `json:"expectedDeliveryDate,omitempty"`
	Remark               string `json:"remark,omitempty"`
}

// OrderCancelRequestInfo 订单取消申请信息
type OrderCancelRequestInfo struct {
	ID           uint64     `json:"id"`
	OrderID      uint64     `json:"orderId"`
	StoreID      uint64     `json:"storeId"`
	Reason       string     `json:"reason"`
	Status       string     `json:"status"`
	SubmitTime   time.Time  `json:"submitTime"`
	AuditTime    *time.Time `json:"auditTime,omitempty"`
	AuditorID    uint64     `json:"auditorId,omitempty"`
	RejectReason string     `json:"rejectReason,omitempty"`
}

// CreateCancelRequest 创建取消申请请求
type CreateCancelRequest struct {
	OrderID uint64 `json:"orderId" validate:"required"`
	Reason  string `json:"reason" validate:"required,max=500"`
}

// AuditCancelRequest 审核取消申请请求
type AuditCancelRequest struct {
	Approved     bool   `json:"approved"`
	RejectReason string `json:"rejectReason"`
}

// OrderQueryParams 订单查询参数
type OrderQueryParams struct {
	PaginationQuery
	Status       string `json:"status" query:"status"`
	StoreID      uint64 `json:"storeId" query:"storeId"`
	SupplierID   uint64 `json:"supplierId" query:"supplierId"`
	OrderNo      string `json:"orderNo" query:"orderNo"`
	StartDate    string `json:"startDate" query:"startDate"`
	EndDate      string `json:"endDate" query:"endDate"`
	Keyword      string `json:"keyword" query:"keyword"`
}

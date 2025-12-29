package types

import "time"

// WebhookEvent Webhook事件枚举
type WebhookEvent string

const (
	WebhookNewOrder       WebhookEvent = "new_order"
	WebhookOrderConfirmed WebhookEvent = "order_confirmed"
	WebhookOrderDelivered WebhookEvent = "order_delivered"
	WebhookOrderCompleted WebhookEvent = "order_completed"
	WebhookOrderCancelled WebhookEvent = "order_cancelled"
	WebhookPriceUpdated   WebhookEvent = "price_updated"
	WebhookStockChanged   WebhookEvent = "stock_changed"
)

// WebhookTargetType Webhook目标类型
type WebhookTargetType string

const (
	WebhookTargetStore    WebhookTargetType = "store"
	WebhookTargetSupplier WebhookTargetType = "supplier"
)

// WebhookStatus Webhook状态
type WebhookStatus string

const (
	WebhookPending WebhookStatus = "pending"
	WebhookSuccess WebhookStatus = "success"
	WebhookFailed  WebhookStatus = "failed"
)

// WebhookPayload Webhook推送载荷
type WebhookPayload struct {
	Event     WebhookEvent `json:"event"`
	Timestamp int64        `json:"timestamp"`
	Data      interface{}  `json:"data"`
	Signature string       `json:"signature,omitempty"`
}

// WebhookLogInfo Webhook推送日志信息
type WebhookLogInfo struct {
	ID            uint64            `json:"id"`
	TargetType    WebhookTargetType `json:"targetType"`
	TargetID      uint64            `json:"targetId"`
	Event         WebhookEvent      `json:"event"`
	WebhookURL    string            `json:"webhookUrl"`
	RequestBody   string            `json:"requestBody"`
	ResponseCode  int               `json:"responseCode,omitempty"`
	ResponseBody  string            `json:"responseBody,omitempty"`
	Status        WebhookStatus     `json:"status"`
	RetryCount    int               `json:"retryCount"`
	NextRetryTime *time.Time        `json:"nextRetryTime,omitempty"`
	ErrorMessage  string            `json:"errorMessage,omitempty"`
	CreatedAt     time.Time         `json:"createdAt"`
	UpdatedAt     time.Time         `json:"updatedAt"`
}

// WebhookQueryParams Webhook日志查询参数
type WebhookQueryParams struct {
	PaginationQuery
	TargetType WebhookTargetType `json:"targetType" query:"targetType"`
	TargetID   uint64            `json:"targetId" query:"targetId"`
	Event      WebhookEvent      `json:"event" query:"event"`
	Status     WebhookStatus     `json:"status" query:"status"`
	StartDate  string            `json:"startDate" query:"startDate"`
	EndDate    string            `json:"endDate" query:"endDate"`
}

// WebhookConfigInfo Webhook配置信息
type WebhookConfigInfo struct {
	WebhookURL     string         `json:"webhookUrl"`
	WebhookEnabled bool           `json:"webhookEnabled"`
	WebhookEvents  []WebhookEvent `json:"webhookEvents"`
}

// UpdateWebhookConfigRequest 更新Webhook配置请求
type UpdateWebhookConfigRequest struct {
	WebhookURL     string         `json:"webhookUrl" validate:"url"`
	WebhookEnabled bool           `json:"webhookEnabled"`
	WebhookEvents  []WebhookEvent `json:"webhookEvents"`
}

// OrderWebhookData 订单Webhook数据
type OrderWebhookData struct {
	OrderNo        string      `json:"orderNo"`
	OrderID        uint64      `json:"orderId"`
	Status         OrderStatus `json:"status"`
	TotalAmount    float64     `json:"totalAmount"`
	ItemCount      int         `json:"itemCount"`
	StoreName      string      `json:"storeName,omitempty"`
	SupplierName   string      `json:"supplierName,omitempty"`
	DeliveryDate   string      `json:"deliveryDate,omitempty"`
	Remark         string      `json:"remark,omitempty"`
}

// PriceWebhookData 价格变动Webhook数据
type PriceWebhookData struct {
	MaterialSkuID uint64  `json:"materialSkuId"`
	MaterialName  string  `json:"materialName"`
	Brand         string  `json:"brand"`
	Spec          string  `json:"spec"`
	OldPrice      float64 `json:"oldPrice"`
	NewPrice      float64 `json:"newPrice"`
	SupplierID    uint64  `json:"supplierId"`
	SupplierName  string  `json:"supplierName"`
}

// StockWebhookData 库存变动Webhook数据
type StockWebhookData struct {
	MaterialSkuID uint64      `json:"materialSkuId"`
	MaterialName  string      `json:"materialName"`
	Brand         string      `json:"brand"`
	Spec          string      `json:"spec"`
	OldStatus     StockStatus `json:"oldStatus"`
	NewStatus     StockStatus `json:"newStatus"`
	SupplierID    uint64      `json:"supplierId"`
	SupplierName  string      `json:"supplierName"`
}

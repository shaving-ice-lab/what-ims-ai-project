package database

import (
	"time"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
)

// Base model with common fields
type BaseModel struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// User 用户表
type User struct {
	BaseModel
	Username       string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	PasswordHash   string    `gorm:"type:varchar(255);not null" json:"-"`
	Role           string    `gorm:"type:enum('admin','sub_admin','supplier','store');not null" json:"role"`
	Phone          string    `gorm:"type:varchar(20);uniqueIndex" json:"phone"`
	Email          string    `gorm:"type:varchar(100)" json:"email"`
	Avatar         string    `gorm:"type:varchar(500)" json:"avatar"`
	LastLoginAt    *time.Time `json:"last_login_at"`
	LastLoginIP    string    `gorm:"type:varchar(50)" json:"last_login_ip"`
	LoginFailCount int       `gorm:"default:0" json:"login_fail_count"`
	LockedUntil    *time.Time `json:"locked_until"`
	Status         bool      `gorm:"default:true" json:"status"`
}

// Admin 管理员表
type Admin struct {
	BaseModel
	UserID      uint     `gorm:"uniqueIndex;not null" json:"user_id"`
	User        *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Name        string   `gorm:"type:varchar(50);not null" json:"name"`
	IsPrimary   bool     `gorm:"default:false" json:"is_primary"`
	Permissions []string `gorm:"type:json" json:"permissions"`
	CreatedBy   *uint    `json:"created_by"`
	Remark      string   `gorm:"type:varchar(200)" json:"remark"`
	Status      bool     `gorm:"default:true" json:"status"`
}

// Store 门店表
type Store struct {
	BaseModel
	UserID         uint   `gorm:"uniqueIndex;not null" json:"user_id"`
	User           *User  `gorm:"foreignKey:UserID" json:"user,omitempty"`
	StoreNo        string `gorm:"type:varchar(20);uniqueIndex" json:"store_no"`
	Name           string `gorm:"type:varchar(100);not null" json:"name"`
	Logo           string `gorm:"type:varchar(500)" json:"logo"`
	Province       string `gorm:"type:varchar(50)" json:"province"`
	City           string `gorm:"type:varchar(50)" json:"city"`
	District       string `gorm:"type:varchar(50)" json:"district"`
	Address        string `gorm:"type:varchar(200)" json:"address"`
	Latitude       float64 `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude      float64 `gorm:"type:decimal(10,7)" json:"longitude"`
	ContactName    string `gorm:"type:varchar(50);not null" json:"contact_name"`
	ContactPhone   string `gorm:"type:varchar(20);not null" json:"contact_phone"`
	MarkupEnabled  bool   `gorm:"default:true" json:"markup_enabled"`
	WebhookURL     string `gorm:"type:varchar(500);column:wechat_webhook_url" json:"webhook_url"`
	WebhookEnabled bool   `gorm:"default:false" json:"webhook_enabled"`
	Status         bool   `gorm:"default:true" json:"status"`
}

// Supplier 供应商表
type Supplier struct {
	BaseModel
	UserID          uint     `gorm:"not null" json:"user_id"`
	User            *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	SupplierNo      string   `gorm:"type:varchar(20);uniqueIndex" json:"supplier_no"`
	Name            string   `gorm:"type:varchar(100);not null" json:"name"`
	DisplayName     string   `gorm:"type:varchar(100)" json:"display_name"`
	Logo            string   `gorm:"type:varchar(500)" json:"logo"`
	ContactName     string   `gorm:"type:varchar(50);not null" json:"contact_name"`
	ContactPhone    string   `gorm:"type:varchar(20);not null" json:"contact_phone"`
	MinOrderAmount  float64  `gorm:"type:decimal(10,2);default:0" json:"min_order_amount"`
	DeliveryDays    []int    `gorm:"type:json" json:"delivery_days"`
	DeliveryMode    string   `gorm:"type:enum('self_delivery','express_delivery')" json:"delivery_mode"`
	ManagementMode  string   `gorm:"type:enum('self','managed','webhook','api')" json:"management_mode"`
	HasBackend      bool     `gorm:"default:true" json:"has_backend"`
	WebhookURL      string   `gorm:"type:varchar(500);column:wechat_webhook_url" json:"webhook_url"`
	WebhookEnabled  bool     `gorm:"default:false" json:"webhook_enabled"`
	WebhookEvents   []string `gorm:"type:json" json:"webhook_events"`
	APIEndpoint     string   `gorm:"type:varchar(500)" json:"api_endpoint"`
	APISecretKey    string   `gorm:"type:varchar(100)" json:"-"`
	MarkupEnabled   bool     `gorm:"default:true" json:"markup_enabled"`
	Remark          string   `gorm:"type:text" json:"remark"`
	Status          bool     `gorm:"default:true" json:"status"`
}

// DeliveryArea 配送区域表
type DeliveryArea struct {
	BaseModel
	SupplierID uint      `gorm:"not null;index" json:"supplier_id"`
	Supplier   *Supplier `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	Province   string    `gorm:"type:varchar(50);not null" json:"province"`
	City       string    `gorm:"type:varchar(50);not null" json:"city"`
	District   string    `gorm:"type:varchar(50)" json:"district"`
	Status     bool      `gorm:"default:true" json:"status"`
}

// Category 物料分类表
type Category struct {
	BaseModel
	Name          string     `gorm:"type:varchar(50);not null" json:"name"`
	Icon          string     `gorm:"type:varchar(500)" json:"icon"`
	SortOrder     int        `gorm:"default:0" json:"sort_order"`
	ParentID      *uint      `gorm:"index" json:"parent_id"`
	Parent        *Category  `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children      []Category `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	Level         int        `gorm:"type:tinyint" json:"level"`
	Path          string     `gorm:"type:varchar(200)" json:"path"`
	MarkupEnabled bool       `gorm:"default:true" json:"markup_enabled"`
	Status        bool       `gorm:"default:true" json:"status"`
}

// Material 物料表
type Material struct {
	BaseModel
	MaterialNo string    `gorm:"type:varchar(20);uniqueIndex" json:"material_no"`
	CategoryID uint      `gorm:"not null;index" json:"category_id"`
	Category   *Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name       string    `gorm:"type:varchar(100);not null;index" json:"name"`
	Alias      string    `gorm:"type:varchar(100)" json:"alias"`
	Description string   `gorm:"type:text" json:"description"`
	ImageURL   string    `gorm:"type:varchar(500)" json:"image_url"`
	Keywords   string    `gorm:"type:varchar(200)" json:"keywords"`
	SortOrder  int       `gorm:"default:0" json:"sort_order"`
	Status     bool      `gorm:"default:true" json:"status"`
}

// MaterialSku 物料SKU表
type MaterialSku struct {
	BaseModel
	SkuNo      string    `gorm:"type:varchar(30);uniqueIndex" json:"sku_no"`
	MaterialID uint      `gorm:"not null;index" json:"material_id"`
	Material   *Material `gorm:"foreignKey:MaterialID" json:"material,omitempty"`
	Brand      string    `gorm:"type:varchar(50);not null;index" json:"brand"`
	Spec       string    `gorm:"type:varchar(100);not null" json:"spec"`
	Unit       string    `gorm:"type:varchar(20);not null" json:"unit"`
	Weight     float64   `gorm:"type:decimal(10,3)" json:"weight"`
	Barcode    string    `gorm:"type:varchar(50);index" json:"barcode"`
	ImageURL   string    `gorm:"type:varchar(500)" json:"image_url"`
	Status     bool      `gorm:"default:true" json:"status"`
}

// SupplierMaterial 供应商物料表
type SupplierMaterial struct {
	BaseModel
	SupplierID    uint         `gorm:"not null;index;uniqueIndex:uk_supplier_sku" json:"supplier_id"`
	Supplier      *Supplier    `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	MaterialSkuID uint         `gorm:"not null;index;uniqueIndex:uk_supplier_sku" json:"material_sku_id"`
	MaterialSku   *MaterialSku `gorm:"foreignKey:MaterialSkuID" json:"material_sku,omitempty"`
	Price         float64      `gorm:"type:decimal(10,2);not null;index" json:"price"`
	OriginalPrice float64      `gorm:"type:decimal(10,2)" json:"original_price"`
	MinQuantity   int          `gorm:"default:1" json:"min_quantity"`
	StepQuantity  int          `gorm:"default:1" json:"step_quantity"`
	StockStatus   string       `gorm:"type:enum('in_stock','out_of_stock');default:'in_stock';index" json:"stock_status"`
	AuditStatus   string       `gorm:"type:enum('pending','approved','rejected');index" json:"audit_status"`
	RejectReason  string       `gorm:"type:varchar(200)" json:"reject_reason"`
	IsRecommended bool         `gorm:"default:false" json:"is_recommended"`
	SalesCount    int          `gorm:"default:0" json:"sales_count"`
	Status        bool         `gorm:"default:true" json:"status"`
}

// Order 订单表
type Order struct {
	BaseModel
	OrderNo              string       `gorm:"type:varchar(30);uniqueIndex;not null" json:"order_no"`
	StoreID              uint         `gorm:"not null;index" json:"store_id"`
	Store                *Store       `gorm:"foreignKey:StoreID" json:"store,omitempty"`
	SupplierID           uint         `gorm:"not null;index" json:"supplier_id"`
	Supplier             *Supplier    `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	GoodsAmount          float64      `gorm:"type:decimal(10,2);not null" json:"goods_amount"`
	ServiceFee           float64      `gorm:"type:decimal(10,2);default:0" json:"service_fee"`
	TotalAmount          float64      `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	SupplierAmount       float64      `gorm:"type:decimal(10,2)" json:"supplier_amount"`
	MarkupTotal          float64      `gorm:"type:decimal(10,2);default:0" json:"markup_total"`
	ItemCount            int          `json:"item_count"`
	Status               string       `gorm:"type:enum('pending_payment','pending_confirm','confirmed','delivering','completed','cancelled');index" json:"status"`
	PaymentStatus        string       `gorm:"type:enum('unpaid','paid','refunded');default:'unpaid';index" json:"payment_status"`
	PaymentMethod        string       `gorm:"type:enum('wechat','alipay')" json:"payment_method"`
	PaymentTime          *time.Time   `json:"payment_time"`
	PaymentNo            string       `gorm:"type:varchar(50)" json:"payment_no"`
	OrderSource          string       `gorm:"type:enum('app','web','h5')" json:"order_source"`
	DeliveryProvince     string       `gorm:"type:varchar(50)" json:"delivery_province"`
	DeliveryCity         string       `gorm:"type:varchar(50)" json:"delivery_city"`
	DeliveryDistrict     string       `gorm:"type:varchar(50)" json:"delivery_district"`
	DeliveryAddress      string       `gorm:"type:varchar(200)" json:"delivery_address"`
	DeliveryContact      string       `gorm:"type:varchar(50)" json:"delivery_contact"`
	DeliveryPhone        string       `gorm:"type:varchar(20)" json:"delivery_phone"`
	ExpectedDeliveryDate *time.Time   `json:"expected_delivery_date"`
	ActualDeliveryTime   *time.Time   `json:"actual_delivery_time"`
	Remark               string       `gorm:"type:varchar(500)" json:"remark"`
	SupplierRemark       string       `gorm:"type:varchar(500)" json:"supplier_remark"`
	CancelReason         string       `gorm:"type:varchar(200)" json:"cancel_reason"`
	CancelledBy          string       `gorm:"type:enum('store','supplier','admin','system')" json:"cancelled_by"`
	CancelledByID        *uint        `json:"cancelled_by_id"`
	CancelledAt          *time.Time   `json:"cancelled_at"`
	RestoredAt           *time.Time   `json:"restored_at"`
	ConfirmedAt          *time.Time   `json:"confirmed_at"`
	DeliveringAt         *time.Time   `json:"delivering_at"`
	CompletedAt          *time.Time   `json:"completed_at"`
	Items                []OrderItem  `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

// OrderItem 订单明细表
type OrderItem struct {
	BaseModel
	OrderID       uint         `gorm:"not null;index" json:"order_id"`
	Order         *Order       `gorm:"foreignKey:OrderID" json:"-"`
	MaterialSkuID uint         `gorm:"index" json:"material_sku_id"`
	MaterialSku   *MaterialSku `gorm:"foreignKey:MaterialSkuID" json:"material_sku,omitempty"`
	MaterialName  string       `gorm:"type:varchar(100)" json:"material_name"`
	Brand         string       `gorm:"type:varchar(50)" json:"brand"`
	Spec          string       `gorm:"type:varchar(100)" json:"spec"`
	Unit          string       `gorm:"type:varchar(20)" json:"unit"`
	ImageURL      string       `gorm:"type:varchar(500)" json:"image_url"`
	Quantity      int          `gorm:"not null" json:"quantity"`
	UnitPrice     float64      `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	MarkupAmount  float64      `gorm:"type:decimal(10,2);default:0" json:"markup_amount"`
	FinalPrice    float64      `gorm:"type:decimal(10,2);not null" json:"final_price"`
	Subtotal      float64      `gorm:"type:decimal(10,2);not null" json:"subtotal"`
}

// OrderStatusLog 订单状态变更日志表
type OrderStatusLog struct {
	BaseModel
	OrderID      uint   `gorm:"not null;index" json:"order_id"`
	Order        *Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	FromStatus   string `gorm:"type:varchar(30)" json:"from_status"`
	ToStatus     string `gorm:"type:varchar(30);not null" json:"to_status"`
	OperatorType string `gorm:"type:enum('store','supplier','admin','system')" json:"operator_type"`
	OperatorID   *uint  `json:"operator_id"`
	Remark       string `gorm:"type:varchar(200)" json:"remark"`
}

// PaymentRecord 支付记录表
type PaymentRecord struct {
	BaseModel
	OrderID          uint       `gorm:"not null;index" json:"order_id"`
	Order            *Order     `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	OrderNo          string     `gorm:"type:varchar(30);not null" json:"order_no"`
	PaymentNo        string     `gorm:"type:varchar(50);uniqueIndex;not null" json:"payment_no"`
	PaymentMethod    string     `gorm:"type:enum('wechat','alipay');not null" json:"payment_method"`
	GoodsAmount      float64    `gorm:"type:decimal(10,2);not null" json:"goods_amount"`
	ServiceFee       float64    `gorm:"type:decimal(10,2);default:0" json:"service_fee"`
	Amount           float64    `gorm:"type:decimal(10,2);not null" json:"amount"`
	Status           string     `gorm:"type:enum('pending','success','failed','refunded','partial_refund');default:'pending';index" json:"status"`
	QRCodeURL        string     `gorm:"type:varchar(500)" json:"qrcode_url"`
	QRCodeExpireTime *time.Time `json:"qrcode_expire_time"`
	TradeNo          string     `gorm:"type:varchar(100);index" json:"trade_no"`
	PayTime          *time.Time `json:"pay_time"`
	CallbackData     JSON       `gorm:"type:json" json:"callback_data"`
	RefundNo         string     `gorm:"type:varchar(50)" json:"refund_no"`
	RefundAmount     float64    `gorm:"type:decimal(10,2)" json:"refund_amount"`
	RefundTime       *time.Time `json:"refund_time"`
	RefundReason     string     `gorm:"type:varchar(200)" json:"refund_reason"`
	ErrorMsg         string     `gorm:"type:varchar(500)" json:"error_msg"`
}

// PriceMarkup 加价规则表
type PriceMarkup struct {
	BaseModel
	Name         string     `gorm:"type:varchar(100);not null" json:"name"`
	Description  string     `gorm:"type:varchar(500)" json:"description"`
	StoreID      *uint      `gorm:"index" json:"store_id"`
	Store        *Store     `gorm:"foreignKey:StoreID" json:"store,omitempty"`
	SupplierID   *uint      `gorm:"index" json:"supplier_id"`
	Supplier     *Supplier  `gorm:"foreignKey:SupplierID" json:"supplier,omitempty"`
	CategoryID   *uint      `json:"category_id"`
	Category     *Category  `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	MaterialID   *uint      `json:"material_id"`
	Material     *Material  `gorm:"foreignKey:MaterialID" json:"material,omitempty"`
	MarkupType   string     `gorm:"type:enum('fixed','percent');not null" json:"markup_type"`
	MarkupValue  float64    `gorm:"type:decimal(10,4);not null" json:"markup_value"`
	MinMarkup    float64    `gorm:"type:decimal(10,2)" json:"min_markup"`
	MaxMarkup    float64    `gorm:"type:decimal(10,2)" json:"max_markup"`
	Priority     int        `gorm:"default:0;index" json:"priority"`
	IsActive     bool       `gorm:"default:true;index" json:"is_active"`
	StartTime    *time.Time `json:"start_time"`
	EndTime      *time.Time `json:"end_time"`
	CreatedBy    uint       `json:"created_by"`
}

// SystemConfig 系统配置表
type SystemConfig struct {
	BaseModel
	ConfigKey   string `gorm:"type:varchar(100);uniqueIndex;not null" json:"config_key"`
	ConfigValue string `gorm:"type:text" json:"config_value"`
	ConfigType  string `gorm:"type:enum('string','number','boolean','json')" json:"config_type"`
	Description string `gorm:"type:varchar(500)" json:"description"`
	IsSensitive bool   `gorm:"default:false" json:"is_sensitive"`
}

// WebhookLog Webhook推送日志表
type WebhookLog struct {
	BaseModel
	TargetType     string     `gorm:"type:enum('store','supplier')" json:"target_type"`
	TargetID       uint       `json:"target_id"`
	EventType      string     `gorm:"type:varchar(50)" json:"event_type"`
	OrderID        uint       `gorm:"index" json:"order_id"`
	Order          *Order     `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	WebhookURL     string     `gorm:"type:varchar(500)" json:"webhook_url"`
	RequestHeaders JSON       `gorm:"type:json" json:"request_headers"`
	RequestBody    JSON       `gorm:"type:json" json:"request_body"`
	ResponseCode   int        `json:"response_code"`
	ResponseBody   string     `gorm:"type:text" json:"response_body"`
	Status         string     `gorm:"type:enum('pending','success','failed');default:'pending';index" json:"status"`
	RetryCount     int        `gorm:"default:0" json:"retry_count"`
	MaxRetryCount  int        `gorm:"default:3" json:"max_retry_count"`
	NextRetryAt    *time.Time `gorm:"index" json:"next_retry_at"`
	ErrorMsg       string     `gorm:"type:varchar(500)" json:"error_msg"`
	DurationMs     int        `json:"duration_ms"`
}

// OperationLog 操作日志表
type OperationLog struct {
	BaseModel
	UserID        uint   `gorm:"index" json:"user_id"`
	UserType      string `gorm:"type:enum('admin','supplier','store');index" json:"user_type"`
	UserName      string `gorm:"type:varchar(50)" json:"user_name"`
	Module        string `gorm:"type:varchar(50);not null;index" json:"module"`
	Action        string `gorm:"type:varchar(50);not null;index" json:"action"`
	TargetType    string `gorm:"type:varchar(50);index" json:"target_type"`
	TargetID      uint   `gorm:"index" json:"target_id"`
	Description   string `gorm:"type:varchar(500)" json:"description"`
	BeforeData    JSON   `gorm:"type:json" json:"before_data"`
	AfterData     JSON   `gorm:"type:json" json:"after_data"`
	DiffData      JSON   `gorm:"type:json" json:"diff_data"`
	IPAddress     string `gorm:"type:varchar(50)" json:"ip_address"`
	UserAgent     string `gorm:"type:varchar(500)" json:"user_agent"`
	RequestURL    string `gorm:"type:varchar(500)" json:"request_url"`
	RequestMethod string `gorm:"type:varchar(10)" json:"request_method"`
}

// JSON type for GORM JSON fields
type JSON map[string]interface{}

func (j JSON) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSON) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, j)
}

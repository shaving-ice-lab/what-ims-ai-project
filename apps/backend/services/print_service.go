package services

import (
	"bytes"
	"fmt"
	"html/template"
	"time"

	"gorm.io/gorm"
)

// PrintService 打印服务
type PrintService struct {
	db *gorm.DB
}

// NewPrintService 创建打印服务
func NewPrintService(db *gorm.DB) *PrintService {
	return &PrintService{db: db}
}

// DeliveryNote 送货单数据
type DeliveryNote struct {
	OrderNo         string             `json:"orderNo"`
	OrderDate       time.Time          `json:"orderDate"`
	SupplierName    string             `json:"supplierName"`
	SupplierPhone   string             `json:"supplierPhone"`
	StoreName       string             `json:"storeName"`
	StoreAddress    string             `json:"storeAddress"`
	StorePhone      string             `json:"storePhone"`
	ContactPerson   string             `json:"contactPerson"`
	ExpectedDate    *time.Time         `json:"expectedDate"`
	Items           []DeliveryNoteItem `json:"items"`
	TotalQuantity   int                `json:"totalQuantity"`
	TotalAmount     float64            `json:"totalAmount"`
	Remark          string             `json:"remark"`
	PrintTime       time.Time          `json:"printTime"`
}

// DeliveryNoteItem 送货单商品项
type DeliveryNoteItem struct {
	Index        int     `json:"index"`
	MaterialName string  `json:"materialName"`
	Brand        string  `json:"brand"`
	Spec         string  `json:"spec"`
	Unit         string  `json:"unit"`
	Quantity     int     `json:"quantity"`
	Price        float64 `json:"price"`
	Amount       float64 `json:"amount"`
}

// PrintQueryParams 打印查询参数
type PrintQueryParams struct {
	OrderIDs  []uint64   `json:"orderIds"`
	StartDate *time.Time `json:"startDate"`
	EndDate   *time.Time `json:"endDate"`
}

// GetDeliveryNote 获取送货单数据
func (s *PrintService) GetDeliveryNote(orderID uint64) (*DeliveryNote, error) {
	// 查询订单信息
	var order struct {
		ID            uint64
		OrderNo       string
		CreatedAt     time.Time
		ExpectedDate  *time.Time
		Remark        string
		TotalAmount   float64
		SupplierID    uint64
		StoreID       uint64
	}

	if err := s.db.Table("orders").
		Select("id, order_no, created_at, expected_date, remark, total_amount, supplier_id, store_id").
		Where("id = ?", orderID).
		First(&order).Error; err != nil {
		return nil, err
	}

	// 查询供应商信息
	var supplier struct {
		Name  string
		Phone string
	}
	s.db.Table("suppliers").
		Select("name, phone").
		Where("id = ?", order.SupplierID).
		First(&supplier)

	// 查询门店信息
	var store struct {
		Name          string
		Address       string
		Phone         string
		ContactPerson string
	}
	s.db.Table("stores").
		Select("name, address, phone, contact_person").
		Where("id = ?", order.StoreID).
		First(&store)

	// 查询订单商品
	var items []DeliveryNoteItem
	s.db.Table("order_items oi").
		Select(`
			ms.name as material_name,
			ms.brand,
			ms.spec,
			ms.unit,
			oi.quantity,
			oi.price,
			(oi.quantity * oi.price) as amount
		`).
		Joins("JOIN material_skus ms ON ms.id = oi.material_sku_id").
		Where("oi.order_id = ?", orderID).
		Scan(&items)

	// 添加序号和计算总数量
	totalQuantity := 0
	for i := range items {
		items[i].Index = i + 1
		totalQuantity += items[i].Quantity
	}

	return &DeliveryNote{
		OrderNo:       order.OrderNo,
		OrderDate:     order.CreatedAt,
		SupplierName:  supplier.Name,
		SupplierPhone: supplier.Phone,
		StoreName:     store.Name,
		StoreAddress:  store.Address,
		StorePhone:    store.Phone,
		ContactPerson: store.ContactPerson,
		ExpectedDate:  order.ExpectedDate,
		Items:         items,
		TotalQuantity: totalQuantity,
		TotalAmount:   order.TotalAmount,
		Remark:        order.Remark,
		PrintTime:     time.Now(),
	}, nil
}

// GetBatchDeliveryNotes 批量获取送货单数据
func (s *PrintService) GetBatchDeliveryNotes(orderIDs []uint64) ([]*DeliveryNote, error) {
	notes := make([]*DeliveryNote, 0, len(orderIDs))
	for _, id := range orderIDs {
		note, err := s.GetDeliveryNote(id)
		if err != nil {
			continue // 跳过获取失败的订单
		}
		notes = append(notes, note)
	}
	return notes, nil
}

// GenerateDeliveryNoteHTML 生成送货单HTML
func (s *PrintService) GenerateDeliveryNoteHTML(note *DeliveryNote) (string, error) {
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>送货单 - {{.OrderNo}}</title>
    <style>
        body { font-family: "Microsoft YaHei", sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; }
        .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        th { background: #f0f0f0; }
        .footer { margin-top: 30px; }
        .sign-area { display: flex; justify-content: space-between; margin-top: 50px; }
        .sign-box { width: 200px; border-bottom: 1px solid #000; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">送 货 单</div>
        <div>{{.SupplierName}}</div>
    </div>
    
    <div class="info-row">
        <span>订单编号：{{.OrderNo}}</span>
        <span>下单时间：{{.OrderDate.Format "2006-01-02 15:04"}}</span>
    </div>
    <div class="info-row">
        <span>收货单位：{{.StoreName}}</span>
        <span>联系人：{{.ContactPerson}}</span>
    </div>
    <div class="info-row">
        <span>收货地址：{{.StoreAddress}}</span>
        <span>联系电话：{{.StorePhone}}</span>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>序号</th>
                <th>商品名称</th>
                <th>品牌</th>
                <th>规格</th>
                <th>单位</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
            </tr>
        </thead>
        <tbody>
            {{range .Items}}
            <tr>
                <td>{{.Index}}</td>
                <td>{{.MaterialName}}</td>
                <td>{{.Brand}}</td>
                <td>{{.Spec}}</td>
                <td>{{.Unit}}</td>
                <td>{{.Quantity}}</td>
                <td>{{printf "%.2f" .Price}}</td>
                <td>{{printf "%.2f" .Amount}}</td>
            </tr>
            {{end}}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5">合计</td>
                <td>{{.TotalQuantity}}</td>
                <td>-</td>
                <td>{{printf "%.2f" .TotalAmount}}</td>
            </tr>
        </tfoot>
    </table>
    
    {{if .Remark}}
    <div>备注：{{.Remark}}</div>
    {{end}}
    
    <div class="footer">
        <div class="sign-area">
            <div>送货人签字：<span class="sign-box"></span></div>
            <div>收货人签字：<span class="sign-box"></span></div>
            <div>日期：<span class="sign-box"></span></div>
        </div>
    </div>
    
    <div style="margin-top: 20px; font-size: 10px; color: #666;">
        打印时间：{{.PrintTime.Format "2006-01-02 15:04:05"}}
    </div>
</body>
</html>
`

	t, err := template.New("delivery").Parse(tmpl)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, note); err != nil {
		return "", err
	}

	return buf.String(), nil
}

// GetOrdersForPrint 获取可打印的订单列表
func (s *PrintService) GetOrdersForPrint(supplierID uint64, params *PrintQueryParams) ([]map[string]interface{}, error) {
	var orders []map[string]interface{}

	query := s.db.Table("orders o").
		Select(`
			o.id,
			o.order_no,
			o.created_at,
			o.expected_date,
			o.total_amount,
			o.status,
			s.name as store_name,
			(SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
		`).
		Joins("JOIN stores s ON s.id = o.store_id").
		Where("o.supplier_id = ?", supplierID).
		Where("o.status IN ?", []string{"confirmed", "delivering", "completed"})

	if params.StartDate != nil {
		query = query.Where("o.created_at >= ?", params.StartDate)
	}
	if params.EndDate != nil {
		query = query.Where("o.created_at <= ?", params.EndDate)
	}

	if err := query.Order("o.created_at DESC").Find(&orders).Error; err != nil {
		return nil, err
	}

	return orders, nil
}

// MarkAsPrinted 标记订单已打印
func (s *PrintService) MarkAsPrinted(orderIDs []uint64) error {
	return s.db.Table("orders").
		Where("id IN ?", orderIDs).
		Update("printed_at", time.Now()).Error
}

// GetPrintTemplate 获取打印模板配置
func (s *PrintService) GetPrintTemplate() (map[string]interface{}, error) {
	var config struct {
		Value string
	}
	
	if err := s.db.Table("system_configs").
		Select("config_value as value").
		Where("config_key = ?", "delivery_note_template").
		First(&config).Error; err != nil {
		// 返回默认配置
		return map[string]interface{}{
			"showLogo":       true,
			"showPrice":      true,
			"showRemark":     true,
			"showSignArea":   true,
			"paperSize":      "A4",
			"orientation":    "portrait",
		}, nil
	}

	// 解析JSON配置
	return map[string]interface{}{
		"template": config.Value,
	}, nil
}

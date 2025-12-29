package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// GetOrdersAdmin 管理员获取订单列表
func GetOrdersAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		page, _ := strconv.Atoi(c.QueryParam("page"))
		if page <= 0 {
			page = 1
		}
		pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}

		var total int64
		var orders []models.Order

		query := db.Model(&models.Order{})

		// 按状态筛选
		status := c.QueryParam("status")
		if status != "" {
			query = query.Where("status = ?", status)
		}

		// 按供应商筛选
		supplierID := c.QueryParam("supplierId")
		if supplierID != "" {
			query = query.Where("supplier_id = ?", supplierID)
		}

		// 按门店筛选
		storeID := c.QueryParam("storeId")
		if storeID != "" {
			query = query.Where("store_id = ?", storeID)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Store").Preload("Supplier").Preload("OrderItems.MaterialSku.Material").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&orders).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, orders, total, page, pageSize)
	}
}

// GetOrderDetailAdmin 管理员获取订单详情
func GetOrderDetailAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !IsAdmin(c) {
			return ErrorResponse(c, http.StatusForbidden, "无权访问")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		var order models.Order
		if err := db.Preload("Store").Preload("Supplier").Preload("OrderItems.MaterialSku.Material.Category").
			First(&order, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, order)
	}
}

// UpdateOrderStatusAdmin 管理员更新订单状态
func UpdateOrderStatusAdmin(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现管理员更新订单状态
		return SuccessResponse(c, nil)
	}
}

// GetOrdersSupplier 供应商获取订单列表
func GetOrdersSupplier(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		page, _ := strconv.Atoi(c.QueryParam("page"))
		if page <= 0 {
			page = 1
		}
		pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}

		var total int64
		var orders []models.Order

		query := db.Model(&models.Order{}).Where("supplier_id = ?", supplierID)

		// 按状态筛选
		status := c.QueryParam("status")
		if status != "" {
			query = query.Where("status = ?", status)
		}

		// 按日期筛选
		startDate := c.QueryParam("startDate")
		endDate := c.QueryParam("endDate")
		if startDate != "" && endDate != "" {
			query = query.Where("created_at BETWEEN ? AND ?", startDate+" 00:00:00", endDate+" 23:59:59")
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Store").Preload("OrderItems.MaterialSku.Material").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&orders).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, orders, total, page, pageSize)
	}
}

// GetOrderDetailSupplier 供应商获取订单详情
func GetOrderDetailSupplier(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		var order models.Order
		if err := db.Where("id = ? AND supplier_id = ?", id, supplierID).
			Preload("Store").Preload("OrderItems.MaterialSku.Material").
			First(&order).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, order)
	}
}

// ConfirmOrder 确认订单
func ConfirmOrder(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		supplierID := GetSupplierID(c)
		if supplierID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的ID")
		}

		var order models.Order
		if err := db.Where("id = ? AND supplier_id = ?", id, supplierID).First(&order).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		if order.Status != models.OrderStatusPendingConfirm {
			return ErrorResponse(c, http.StatusBadRequest, "订单状态不允许确认")
		}

		now := time.Now()
		updates := map[string]interface{}{
			"status":       models.OrderStatusConfirmed,
			"confirmed_at": &now,
		}

		if err := db.Model(&order).Updates(updates).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "确认订单失败")
		}

		return SuccessResponse(c, nil)
	}
}

// DeliverOrder 开始配送
func DeliverOrder(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现开始配送
		return SuccessResponse(c, nil)
	}
}

// CompleteOrder 完成订单
func CompleteOrder(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现完成订单
		return SuccessResponse(c, nil)
	}
}

// GetOrdersStore 门店获取订单列表
func GetOrdersStore(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		page, _ := strconv.Atoi(c.QueryParam("page"))
		if page <= 0 {
			page = 1
		}
		pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
		if pageSize <= 0 || pageSize > 100 {
			pageSize = 20
		}

		var total int64
		var orders []models.Order

		query := db.Model(&models.Order{}).Where("store_id = ?", storeID)

		// 按状态筛选
		status := c.QueryParam("status")
		if status != "" {
			query = query.Where("status = ?", status)
		}

		// 按供应商筛选
		supplierID := c.QueryParam("supplierId")
		if supplierID != "" {
			query = query.Where("supplier_id = ?", supplierID)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		err := query.Preload("Supplier").Preload("OrderItems.MaterialSku.Material").
			Order("created_at DESC").
			Offset(offset).Limit(pageSize).
			Find(&orders).Error

		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessPageResponse(c, orders, total, page, pageSize)
	}
}

// GetOrderDetailStore 门店获取订单详情
func GetOrderDetailStore(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现门店获取订单详情
		return SuccessResponse(c, nil)
	}
}

// CreateOrder 创建订单
func CreateOrder(db *gorm.DB, redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		type OrderItemRequest struct {
			MaterialSkuID uint64  `json:"materialSkuId" validate:"required"`
			Quantity      int     `json:"quantity" validate:"required,min=1"`
			UnitPrice     float64 `json:"unitPrice" validate:"required"`
			FinalPrice    float64 `json:"finalPrice" validate:"required"`
			MarkupAmount  float64 `json:"markupAmount"`
		}

		type CreateOrderRequest struct {
			SupplierID   uint64             `json:"supplierId" validate:"required"`
			Items        []OrderItemRequest `json:"items" validate:"required,min=1"`
			Remark       string             `json:"remark"`
			DeliveryInfo struct {
				Province string `json:"province"`
				City     string `json:"city"`
				District string `json:"district"`
				Address  string `json:"address"`
				Contact  string `json:"contact"`
				Phone    string `json:"phone"`
			} `json:"deliveryInfo"`
		}

		var req CreateOrderRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		if err := c.Validate(req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "参数验证失败")
		}

		// 计算订单金额
		var goodsAmount, markupTotal float64
		var itemCount int
		for _, item := range req.Items {
			goodsAmount += item.FinalPrice * float64(item.Quantity)
			markupTotal += item.MarkupAmount * float64(item.Quantity)
			itemCount++
		}

		// 计算服务费
		serviceFee := goodsAmount * 0.003 // 0.3%服务费
		totalAmount := goodsAmount + serviceFee
		supplierAmount := goodsAmount - markupTotal

		// 开始事务
		tx := db.Begin()

		// 创建订单
		order := &models.Order{
			StoreID:        storeID,
			SupplierID:     req.SupplierID,
			GoodsAmount:    goodsAmount,
			ServiceFee:     serviceFee,
			TotalAmount:    totalAmount,
			SupplierAmount: supplierAmount,
			MarkupTotal:    markupTotal,
			ItemCount:      itemCount,
			Status:         models.OrderStatusPendingPayment,
			PaymentStatus:  models.PaymentStatusUnpaid,
			OrderSource:    models.OrderSourceWeb,
		}

		if req.Remark != "" {
			order.Remark = &req.Remark
		}

		// 设置配送信息
		if req.DeliveryInfo.Province != "" {
			order.DeliveryProvince = &req.DeliveryInfo.Province
			order.DeliveryCity = &req.DeliveryInfo.City
			order.DeliveryDistrict = &req.DeliveryInfo.District
			order.DeliveryAddress = &req.DeliveryInfo.Address
			order.DeliveryContact = &req.DeliveryInfo.Contact
			order.DeliveryPhone = &req.DeliveryInfo.Phone
		}

		if err := tx.Create(order).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "创建订单失败")
		}

		// 创建订单明细
		for _, item := range req.Items {
			// 获取SKU信息
			var sku models.MaterialSku
			if err := tx.Preload("Material").First(&sku, item.MaterialSkuID).Error; err != nil {
				tx.Rollback()
				return ErrorResponse(c, http.StatusBadRequest, "物料SKU不存在")
			}

			orderItem := &models.OrderItem{
				OrderID:       order.ID,
				MaterialSkuID: item.MaterialSkuID,
				MaterialName:  sku.Material.Name,
				Brand:         sku.Brand,
				Spec:          sku.Spec,
				Unit:          sku.Unit,
				ImageURL:      sku.ImageURL,
				Quantity:      item.Quantity,
				UnitPrice:     item.UnitPrice,
				MarkupAmount:  item.MarkupAmount,
				FinalPrice:    item.FinalPrice,
				Subtotal:      item.FinalPrice * float64(item.Quantity),
			}

			if err := tx.Create(orderItem).Error; err != nil {
				tx.Rollback()
				return ErrorResponse(c, http.StatusInternalServerError, "创建订单明细失败")
			}
		}

		// 清空购物车（如果需要）
		// TODO: 清空Redis中对应供应商的购物车

		tx.Commit()

		return SuccessResponse(c, map[string]interface{}{
			"orderId": order.ID,
			"orderNo": order.OrderNo,
		})
	}
}

// CancelOrder 取消订单
func CancelOrder(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现取消订单
		return SuccessResponse(c, nil)
	}
}

// ReorderItems 再来一单
func ReorderItems(db *gorm.DB, redis *redis.Client) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现再来一单
		return SuccessResponse(c, nil)
	}
}

// GeneratePaymentQRCode 生成支付二维码
func GeneratePaymentQRCode(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现生成支付二维码
		return SuccessResponse(c, map[string]string{
			"qrCodeUrl": "https://example.com/qrcode",
		})
	}
}

// GetPaymentStatus 获取支付状态
func GetPaymentStatus(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// TODO: 实现获取支付状态
		return SuccessResponse(c, map[string]string{
			"status": "unpaid",
		})
	}
}

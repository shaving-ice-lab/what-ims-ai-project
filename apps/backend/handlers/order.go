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

// CancelOrder 取消订单（1小时内自主取消）
func CancelOrder(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		orderID, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的订单ID")
		}

		type CancelRequest struct {
			Reason string `json:"reason" validate:"required"`
		}

		var req CancelRequest
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		// 查询订单
		var order models.Order
		if err := db.First(&order, orderID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 验证订单归属
		if order.StoreID != storeID {
			return ErrorResponse(c, http.StatusForbidden, "无权操作此订单")
		}

		// 检查订单状态
		if order.Status != models.OrderStatusPendingConfirm {
			return ErrorResponse(c, http.StatusBadRequest, "当前订单状态不允许取消")
		}

		// 检查是否在1小时内
		threshold := time.Hour * 1
		if time.Since(order.CreatedAt) > threshold {
			return ErrorResponse(c, http.StatusBadRequest, "订单已超过1小时，请提交取消申请")
		}

		// 执行取消
		tx := db.Begin()
		now := time.Now()
		cancelledBy := models.CancelledByStore

		updates := map[string]interface{}{
			"status":          models.OrderStatusCancelled,
			"cancel_reason":   req.Reason,
			"cancelled_by":    cancelledBy,
			"cancelled_by_id": storeID,
			"cancelled_at":    now,
		}

		if err := tx.Model(&order).Updates(updates).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "取消订单失败")
		}

		// 创建状态日志
		fromStatus := string(order.Status)
		toStatus := string(models.OrderStatusCancelled)
		operatorType := models.OperatorTypeStore
		log := &models.OrderStatusLog{
			OrderID:      orderID,
			FromStatus:   &fromStatus,
			ToStatus:     toStatus,
			OperatorType: &operatorType,
			OperatorID:   &storeID,
			Remark:       &req.Reason,
		}

		if err := tx.Create(log).Error; err != nil {
			tx.Rollback()
			return ErrorResponse(c, http.StatusInternalServerError, "记录日志失败")
		}

		tx.Commit()

		return SuccessResponse(c, map[string]interface{}{
			"message": "订单已取消",
		})
	}
}

// SubmitCancelRequest 提交取消申请（超过1小时）
func SubmitCancelRequest(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		orderID, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的订单ID")
		}

		type CancelRequestBody struct {
			Reason string `json:"reason" validate:"required"`
		}

		var req CancelRequestBody
		if err := c.Bind(&req); err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请求参数错误")
		}

		// 查询订单
		var order models.Order
		if err := db.First(&order, orderID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 验证订单归属
		if order.StoreID != storeID {
			return ErrorResponse(c, http.StatusForbidden, "无权操作此订单")
		}

		// 检查订单状态
		if order.Status != models.OrderStatusPendingConfirm && order.Status != models.OrderStatusConfirmed {
			return ErrorResponse(c, http.StatusBadRequest, "当前订单状态不允许提交取消申请")
		}

		// 检查是否已有待处理的取消申请
		var existingRequest models.OrderCancelRequest
		err = db.Where("order_id = ? AND status = ?", orderID, models.CancelRequestPending).First(&existingRequest).Error
		if err == nil {
			return ErrorResponse(c, http.StatusConflict, "该订单已有待处理的取消申请")
		}

		// 创建取消申请
		cancelRequest := &models.OrderCancelRequest{
			OrderID: orderID,
			StoreID: storeID,
			Reason:  req.Reason,
			Status:  models.CancelRequestPending,
		}

		if err := db.Create(cancelRequest).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "提交申请失败")
		}

		return SuccessResponse(c, map[string]interface{}{
			"message":   "取消申请已提交，请等待审批",
			"requestId": cancelRequest.ID,
		})
	}
}

// GetCancelRequestStatus 获取取消申请状态
func GetCancelRequestStatus(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		storeID := GetStoreID(c)
		if storeID == 0 {
			return ErrorResponse(c, http.StatusUnauthorized, "未授权")
		}

		orderID, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的订单ID")
		}

		var request models.OrderCancelRequest
		if err := db.Where("order_id = ? AND store_id = ?", orderID, storeID).
			Order("created_at DESC").First(&request).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "未找到取消申请")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		return SuccessResponse(c, request)
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

// ExportOrdersExcel 导出订单Excel
func ExportOrdersExcel(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// 获取筛选参数
		status := c.QueryParam("status")
		supplierID := c.QueryParam("supplierId")
		storeID := c.QueryParam("storeId")
		startDate := c.QueryParam("startDate")
		endDate := c.QueryParam("endDate")

		// 构建查询
		query := db.Model(&models.Order{})

		if status != "" {
			query = query.Where("status = ?", status)
		}
		if supplierID != "" {
			query = query.Where("supplier_id = ?", supplierID)
		}
		if storeID != "" {
			query = query.Where("store_id = ?", storeID)
		}
		if startDate != "" {
			query = query.Where("created_at >= ?", startDate)
		}
		if endDate != "" {
			query = query.Where("created_at <= ?", endDate+" 23:59:59")
		}

		// 根据角色过滤
		if IsSupplier(c) {
			supplierID := GetSupplierID(c)
			query = query.Where("supplier_id = ?", supplierID)
		} else if IsStore(c) {
			storeID := GetStoreID(c)
			query = query.Where("store_id = ?", storeID)
		}

		var orders []models.Order
		if err := query.Preload("Store").Preload("Supplier").Preload("OrderItems").
			Order("created_at DESC").Limit(5000).Find(&orders).Error; err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "查询订单失败")
		}

		// 构建导出数据
		type ExportRow struct {
			OrderNo          string  `json:"orderNo"`
			StoreName        string  `json:"storeName"`
			SupplierName     string  `json:"supplierName"`
			GoodsAmount      float64 `json:"goodsAmount"`
			ServiceFee       float64 `json:"serviceFee"`
			TotalAmount      float64 `json:"totalAmount"`
			MarkupTotal      float64 `json:"markupTotal"`
			ItemCount        int     `json:"itemCount"`
			Status           string  `json:"status"`
			PaymentStatus    string  `json:"paymentStatus"`
			DeliveryAddress  string  `json:"deliveryAddress"`
			DeliveryContact  string  `json:"deliveryContact"`
			DeliveryPhone    string  `json:"deliveryPhone"`
			ExpectedDelivery string  `json:"expectedDelivery"`
			Remark           string  `json:"remark"`
			CreatedAt        string  `json:"createdAt"`
		}

		var exportData []ExportRow
		statusMap := map[models.OrderStatus]string{
			models.OrderStatusUnpaid:         "待付款",
			models.OrderStatusPendingConfirm: "待确认",
			models.OrderStatusConfirmed:      "已确认",
			models.OrderStatusDelivering:     "配送中",
			models.OrderStatusCompleted:      "已完成",
			models.OrderStatusCancelled:      "已取消",
		}

		for _, order := range orders {
			storeName := ""
			if order.Store != nil {
				storeName = order.Store.Name
			}
			supplierName := ""
			if order.Supplier != nil {
				supplierName = order.Supplier.Name
			}
			expectedDelivery := ""
			if order.ExpectedDeliveryDate != nil {
				expectedDelivery = order.ExpectedDeliveryDate.Format("2006-01-02")
			}
			remark := ""
			if order.Remark != nil {
				remark = *order.Remark
			}

			row := ExportRow{
				OrderNo:          order.OrderNo,
				StoreName:        storeName,
				SupplierName:     supplierName,
				GoodsAmount:      order.GoodsAmount,
				ServiceFee:       order.ServiceFee,
				TotalAmount:      order.TotalAmount,
				MarkupTotal:      order.MarkupTotal,
				ItemCount:        order.ItemCount,
				Status:           statusMap[order.Status],
				PaymentStatus:    string(order.PaymentStatus),
				DeliveryAddress:  order.DeliveryAddress,
				DeliveryContact:  order.DeliveryContact,
				DeliveryPhone:    order.DeliveryPhone,
				ExpectedDelivery: expectedDelivery,
				Remark:           remark,
				CreatedAt:        order.CreatedAt.Format("2006-01-02 15:04:05"),
			}
			exportData = append(exportData, row)
		}

		// 返回JSON数据，前端可以使用xlsx库生成Excel
		return SuccessResponse(c, map[string]interface{}{
			"columns": []map[string]string{
				{"key": "orderNo", "title": "订单编号"},
				{"key": "storeName", "title": "门店名称"},
				{"key": "supplierName", "title": "供应商名称"},
				{"key": "goodsAmount", "title": "商品金额"},
				{"key": "serviceFee", "title": "服务费"},
				{"key": "totalAmount", "title": "总金额"},
				{"key": "markupTotal", "title": "加价金额"},
				{"key": "itemCount", "title": "商品数量"},
				{"key": "status", "title": "订单状态"},
				{"key": "paymentStatus", "title": "支付状态"},
				{"key": "deliveryAddress", "title": "配送地址"},
				{"key": "deliveryContact", "title": "联系人"},
				{"key": "deliveryPhone", "title": "联系电话"},
				{"key": "expectedDelivery", "title": "预计配送日期"},
				{"key": "remark", "title": "备注"},
				{"key": "createdAt", "title": "下单时间"},
			},
			"data":  exportData,
			"total": len(exportData),
		})
	}
}

// ExportOrderItemsExcel 导出订单明细Excel
func ExportOrderItemsExcel(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		orderID, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "无效的订单ID")
		}

		var order models.Order
		if err := db.Preload("OrderItems").First(&order, orderID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrorResponse(c, http.StatusNotFound, "订单不存在")
			}
			return ErrorResponse(c, http.StatusInternalServerError, "查询失败")
		}

		// 构建导出数据
		type ItemExportRow struct {
			MaterialName string  `json:"materialName"`
			Brand        string  `json:"brand"`
			Spec         string  `json:"spec"`
			Unit         string  `json:"unit"`
			Quantity     int     `json:"quantity"`
			UnitPrice    float64 `json:"unitPrice"`
			MarkupAmount float64 `json:"markupAmount"`
			FinalPrice   float64 `json:"finalPrice"`
			Subtotal     float64 `json:"subtotal"`
		}

		var exportData []ItemExportRow
		for _, item := range order.OrderItems {
			row := ItemExportRow{
				MaterialName: item.MaterialName,
				Brand:        item.Brand,
				Spec:         item.Spec,
				Unit:         item.Unit,
				Quantity:     item.Quantity,
				UnitPrice:    item.UnitPrice,
				MarkupAmount: item.MarkupAmount,
				FinalPrice:   item.FinalPrice,
				Subtotal:     item.Subtotal,
			}
			exportData = append(exportData, row)
		}

		return SuccessResponse(c, map[string]interface{}{
			"orderNo": order.OrderNo,
			"columns": []map[string]string{
				{"key": "materialName", "title": "物料名称"},
				{"key": "brand", "title": "品牌"},
				{"key": "spec", "title": "规格"},
				{"key": "unit", "title": "单位"},
				{"key": "quantity", "title": "数量"},
				{"key": "unitPrice", "title": "原价"},
				{"key": "markupAmount", "title": "加价"},
				{"key": "finalPrice", "title": "最终单价"},
				{"key": "subtotal", "title": "小计"},
			},
			"data":  exportData,
			"total": len(exportData),
		})
	}
}

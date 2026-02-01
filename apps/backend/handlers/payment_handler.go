package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/project/backend/config"
	"github.com/project/backend/models"
	"github.com/project/backend/services"
	"gorm.io/gorm"
)

// PaymentHandler 支付处理器
type PaymentHandler struct {
	db             *gorm.DB
	paymentService *services.PaymentService
	wechatService  *services.WeChatPayService
	alipayService  *services.AlipayService
}

// NewPaymentHandler 创建支付处理器
func NewPaymentHandler(db *gorm.DB, cfg *config.Config) *PaymentHandler {
	handler := &PaymentHandler{
		db:             db,
		paymentService: services.NewPaymentService(db),
	}

	// 初始化微信支付服务(如果配置了)
	if cfg.WeChatPay.AppID != "" && cfg.WeChatPay.MchID != "" {
		wechatService, err := services.NewWeChatPayService(&cfg.WeChatPay)
		if err == nil {
			handler.wechatService = wechatService
		}
	}

	// 初始化支付宝服务(如果配置了)
	if cfg.Alipay.AppID != "" && cfg.Alipay.PrivateKey != "" {
		alipayService, err := services.NewAlipayService(&cfg.Alipay)
		if err == nil {
			handler.alipayService = alipayService
		}
	}

	return handler
}

// PaymentMethod 支付方式
type PaymentMethodType string

const (
	PaymentMethodWechat PaymentMethodType = "wechat"
	PaymentMethodAlipay PaymentMethodType = "alipay"
)

// CreatePaymentRequest 创建支付请求
type CreatePaymentReq struct {
	OrderID       uint64            `json:"orderId" validate:"required"`
	PaymentMethod PaymentMethodType `json:"paymentMethod" validate:"required,oneof=wechat alipay"`
}

// SwitchPaymentMethodRequest 切换支付方式请求
type SwitchPaymentMethodRequest struct {
	PaymentNo     string            `json:"paymentNo" validate:"required"`
	PaymentMethod PaymentMethodType `json:"paymentMethod" validate:"required,oneof=wechat alipay"`
}

// CreatePayment 创建支付订单
// @Summary 创建支付订单
// @Tags 支付
// @Accept json
// @Produce json
// @Param request body CreatePaymentReq true "创建请求"
// @Success 200 {object} map[string]interface{}
// @Router /store/payments [post]
func (h *PaymentHandler) CreatePayment(c echo.Context) error {
	var req CreatePaymentReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 查询订单
	var order models.Order
	if err := h.db.First(&order, req.OrderID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在",
		})
	}

	// 检查订单状态
	if order.Status != models.OrderStatusPendingPayment {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "订单状态不允许支付",
		})
	}

	var qrcodeURL string
	var payURL string
	var paymentNo string
	expireTime := time.Now().Add(15 * time.Minute)

	// 根据支付方式创建支付
	switch req.PaymentMethod {
	case PaymentMethodWechat:
		if h.wechatService == nil {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"code":    503,
				"message": "微信支付服务未配置",
			})
		}

		paymentNo = fmt.Sprintf("WX%s%d", time.Now().Format("20060102150405"), order.ID)
		resp, err := h.wechatService.CreateNativePayment(c.Request().Context(), &services.NativePaymentRequest{
			OrderNo:       paymentNo,
			AmountInCents: int64(order.TotalAmount * 100),
			Description:   fmt.Sprintf("供应链订货-订单%s", order.OrderNo),
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"code":    500,
				"message": "创建微信支付失败: " + err.Error(),
			})
		}
		qrcodeURL = resp.QRCodeURL

	case PaymentMethodAlipay:
		if h.alipayService == nil {
			return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
				"code":    503,
				"message": "支付宝服务未配置",
			})
		}

		paymentNo = fmt.Sprintf("ALI%s%d", time.Now().Format("20060102150405"), order.ID)
		resp, err := h.alipayService.CreateNativePayment(c.Request().Context(), &services.AlipayPaymentRequest{
			OrderNo: paymentNo,
			Amount:  order.TotalAmount,
			Subject: fmt.Sprintf("供应链订货-订单%s", order.OrderNo),
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"code":    500,
				"message": "创建支付宝支付失败: " + err.Error(),
			})
		}
		qrcodeURL = resp.QRCodeURL
		payURL = resp.PayURL

	default:
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "不支持的支付方式",
		})
	}

	// 更新订单支付信息
	h.db.Model(&order).Updates(map[string]interface{}{
		"payment_method": string(req.PaymentMethod),
	})

	// 创建支付记录
	h.paymentService.CreatePayment(&services.CreatePaymentRequest{
		OrderID:       order.ID,
		OrderNo:       order.OrderNo,
		GoodsAmount:   order.TotalAmount,
		ServiceFee:    0,
		Amount:        order.TotalAmount,
		PaymentMethod: services.PaymentMethod(req.PaymentMethod),
	})

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "创建成功",
		"data": map[string]interface{}{
			"paymentNo":  paymentNo,
			"qrcodeUrl":  qrcodeURL,
			"payUrl":     payURL,
			"expireTime": expireTime.Format(time.RFC3339),
			"expireIn":   900,
			"amount":     order.TotalAmount,
		},
	})
}

// GetPaymentStatus 查询支付状态
// @Summary 查询支付状态
// @Tags 支付
// @Param paymentNo path string true "支付流水号"
// @Success 200 {object} map[string]interface{}
// @Router /store/payments/{paymentNo}/status [get]
func (h *PaymentHandler) GetPaymentStatus(c echo.Context) error {
	paymentNo := c.Param("paymentNo")
	if paymentNo == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "支付流水号不能为空",
		})
	}

	// 首先查询本地支付记录
	status := "pending"
	var amount float64 = 0
	var tradeNo string

	// 根据支付流水号前缀判断支付方式并查询实际状态
	if len(paymentNo) > 2 {
		prefix := paymentNo[:2]

		switch prefix {
		case "WX":
			// 微信支付查询
			if h.wechatService != nil {
				resp, err := h.wechatService.QueryOrder(c.Request().Context(), paymentNo)
				if err == nil {
					tradeNo = resp.TransactionId
					amount = float64(resp.Amount) / 100
					if resp.TradeState == "SUCCESS" {
						status = "paid"
					} else if resp.TradeState == "CLOSED" || resp.TradeState == "PAYERROR" {
						status = "failed"
					}
				}
			}

		case "AL":
			// 支付宝查询
			if h.alipayService != nil {
				resp, err := h.alipayService.QueryOrder(c.Request().Context(), paymentNo)
				if err == nil {
					tradeNo = resp.TradeNo
					if resp.TradeStatus == "TRADE_SUCCESS" || resp.TradeStatus == "TRADE_FINISHED" {
						status = "paid"
					} else if resp.TradeStatus == "TRADE_CLOSED" {
						status = "failed"
					}
				}
			}
		}
	}

	// 如果第三方查询失败,从本地数据库查询
	if amount == 0 {
		if len(paymentNo) > 14 {
			if orderID, err := strconv.ParseUint(paymentNo[14:], 10, 64); err == nil {
				var order models.Order
				if h.db.First(&order, orderID).Error == nil {
					amount = order.TotalAmount
					if order.Status == models.OrderStatusPendingPayment {
						status = "pending"
					} else {
						status = "paid"
					}
				}
			}
		}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "查询成功",
		"data": map[string]interface{}{
			"paymentNo": paymentNo,
			"status":    status,
			"amount":    amount,
			"tradeNo":   tradeNo,
		},
	})
}

// RefreshQRCode 刷新支付二维码
// @Summary 刷新支付二维码
// @Tags 支付
// @Param paymentNo path string true "支付流水号"
// @Success 200 {object} map[string]interface{}
// @Router /store/payments/{paymentNo}/refresh [post]
func (h *PaymentHandler) RefreshQRCode(c echo.Context) error {
	paymentNo := c.Param("paymentNo")
	if paymentNo == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "支付流水号不能为空",
		})
	}

	// 刷新二维码（重新生成过期时间）
	expireTime := time.Now().Add(15 * time.Minute)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "刷新成功",
		"data": map[string]interface{}{
			"paymentNo":  paymentNo,
			"qrcodeUrl":  fmt.Sprintf("https://pay.example.com/qrcode/%s?t=%d", paymentNo, time.Now().Unix()),
			"expireTime": expireTime.Format(time.RFC3339),
			"expireIn":   900,
		},
	})
}

// SwitchPaymentMethod 切换支付方式
// @Summary 切换支付方式
// @Tags 支付
// @Accept json
// @Produce json
// @Param request body SwitchPaymentMethodRequest true "切换请求"
// @Success 200 {object} map[string]interface{}
// @Router /store/payments/switch-method [post]
func (h *PaymentHandler) SwitchPaymentMethod(c echo.Context) error {
	var req SwitchPaymentMethodRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
	}

	// 切换支付方式
	expireTime := time.Now().Add(15 * time.Minute)

	// 尝试更新订单支付方式
	if len(req.PaymentNo) > 14 {
		if orderID, err := strconv.ParseUint(req.PaymentNo[14:], 10, 64); err == nil {
			h.db.Model(&models.Order{}).Where("id = ?", orderID).Update("payment_method", string(req.PaymentMethod))
		}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "切换成功",
		"data": map[string]interface{}{
			"paymentNo":     req.PaymentNo,
			"paymentMethod": req.PaymentMethod,
			"qrcodeUrl":     fmt.Sprintf("https://pay.example.com/qrcode/%s?method=%s", req.PaymentNo, req.PaymentMethod),
			"expireTime":    expireTime.Format(time.RFC3339),
			"expireIn":      900,
		},
	})
}

// GetPaymentByOrder 根据订单获取支付信息
// @Summary 根据订单获取支付信息
// @Tags 支付
// @Param orderId path int true "订单ID"
// @Success 200 {object} map[string]interface{}
// @Router /store/orders/{orderId}/payment [get]
func (h *PaymentHandler) GetPaymentByOrder(c echo.Context) error {
	orderID := c.Param("orderId")
	if orderID == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    400,
			"message": "订单ID不能为空",
		})
	}

	// 查询订单支付信息
	id, _ := strconv.ParseUint(orderID, 10, 64)
	var order models.Order
	if err := h.db.First(&order, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"code":    404,
			"message": "订单不存在",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    200,
		"message": "查询成功",
		"data": map[string]interface{}{
			"orderId":       order.ID,
			"orderNo":       order.OrderNo,
			"totalAmount":   order.TotalAmount,
			"paymentMethod": order.PaymentMethod,
			"status":        order.Status,
		},
	})
}

// PaymentCallback 支付回调（微信/支付宝通知）
// @Summary 支付回调
// @Tags 支付
// @Accept xml,json
// @Produce json
// @Router /payments/callback/{method} [post]
func (h *PaymentHandler) PaymentCallback(c echo.Context) error {
	method := c.Param("method")

	switch method {
	case "wechat":
		return h.handleWeChatCallback(c)
	case "alipay":
		return h.handleAlipayCallback(c)
	default:
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    "FAIL",
			"message": "未知的支付方式",
		})
	}
}

// handleWeChatCallback 处理微信支付回调
func (h *PaymentHandler) handleWeChatCallback(c echo.Context) error {
	if h.wechatService == nil {
		return c.JSON(http.StatusServiceUnavailable, map[string]interface{}{
			"code":    "FAIL",
			"message": "微信支付服务未配置",
		})
	}

	notification, err := h.wechatService.VerifyCallback(c.Request().Context(), c.Request())
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"code":    "FAIL",
			"message": err.Error(),
		})
	}

	// 只处理支付成功的通知
	if notification.IsPaymentSuccess() {
		// 序列化回调数据
		callbackData, _ := json.Marshal(notification)

		// 更新支付记录
		if err := h.paymentService.HandlePaymentCallback(
			notification.OutTradeNo,
			notification.TransactionId,
			string(callbackData),
		); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"code":    "FAIL",
				"message": "更新支付状态失败",
			})
		}

		// 更新订单状态
		h.updateOrderStatus(notification.OutTradeNo)
	}

	// 微信要求返回这个格式
	return c.JSON(http.StatusOK, map[string]interface{}{
		"code":    "SUCCESS",
		"message": "OK",
	})
}

// handleAlipayCallback 处理支付宝回调
func (h *PaymentHandler) handleAlipayCallback(c echo.Context) error {
	if h.alipayService == nil {
		return c.String(http.StatusServiceUnavailable, "fail")
	}

	notification, err := h.alipayService.VerifyCallback(c.Request())
	if err != nil {
		return c.String(http.StatusBadRequest, "fail")
	}

	// 只处理支付成功的通知
	if notification.IsPaymentSuccess() {
		// 序列化回调数据
		callbackData, _ := json.Marshal(notification)

		// 更新支付记录
		if err := h.paymentService.HandlePaymentCallback(
			notification.OutTradeNo,
			notification.TradeNo,
			string(callbackData),
		); err != nil {
			return c.String(http.StatusInternalServerError, "fail")
		}

		// 更新订单状态
		h.updateOrderStatus(notification.OutTradeNo)
	}

	// 支付宝要求返回"success"字符串
	return c.String(http.StatusOK, "success")
}

// updateOrderStatus 根据支付流水号更新订单状态
func (h *PaymentHandler) updateOrderStatus(paymentNo string) {
	// 从支付流水号提取订单ID
	if len(paymentNo) > 14 {
		// 格式: WX/ALI + 时间戳 + 订单ID
		if orderID, err := strconv.ParseUint(paymentNo[14:], 10, 64); err == nil {
			// 更新订单状态为待确认
			h.db.Model(&models.Order{}).Where("id = ?", orderID).Updates(map[string]interface{}{
				"status":     models.OrderStatusPendingConfirm,
				"updated_at": time.Now(),
			})
		}
	}
}

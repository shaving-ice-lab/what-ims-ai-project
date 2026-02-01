package services

import (
	"context"
	"fmt"
	"net/http"

	"github.com/project/backend/config"
	"github.com/smartwalle/alipay/v3"
)

// AlipayService 支付宝服务
type AlipayService struct {
	client    *alipay.Client
	notifyURL string
	returnURL string
}

// AlipayPaymentRequest 支付宝支付请求
type AlipayPaymentRequest struct {
	OrderNo     string  // 商户订单号
	Amount      float64 // 金额(元)
	Subject     string  // 订单标题
	Description string  // 订单描述
}

// AlipayPaymentResponse 支付宝支付响应
type AlipayPaymentResponse struct {
	PaymentNo string `json:"paymentNo"`
	QRCodeURL string `json:"qrcodeUrl"` // For precreate (native scan)
	PayURL    string `json:"payUrl"`    // For page pay redirect
}

// AlipayNotification 支付宝异步通知
type AlipayNotification struct {
	TradeNo     string // 支付宝交易号
	OutTradeNo  string // 商户订单号
	TradeStatus string // 交易状态: WAIT_BUYER_PAY, TRADE_CLOSED, TRADE_SUCCESS, TRADE_FINISHED
	TotalAmount string // 交易金额
	BuyerID     string // 买家支付宝用户号
	GmtPayment  string // 交易付款时间
}

// AlipayQueryResponse 支付宝查询响应
type AlipayQueryResponse struct {
	TradeNo     string
	OutTradeNo  string
	TradeStatus string
	TotalAmount string
}

// AlipayRefundRequest 支付宝退款请求
type AlipayRefundRequest struct {
	OrderNo      string  // 商户订单号
	RefundNo     string  // 商户退款单号(部分退款时必填)
	RefundAmount float64 // 退款金额(元)
	RefundReason string  // 退款原因
}

// AlipayRefundResponse 支付宝退款响应
type AlipayRefundResponse struct {
	RefundNo     string // 商户退款单号
	TradeNo      string // 支付宝交易号
	RefundAmount string // 退款金额
}

// NewAlipayService 创建支付宝服务
func NewAlipayService(cfg *config.AlipayConfig) (*AlipayService, error) {
	if cfg.AppID == "" {
		return nil, fmt.Errorf("alipay app_id is required")
	}

	client, err := alipay.New(cfg.AppID, cfg.PrivateKey, cfg.IsProduction)
	if err != nil {
		return nil, fmt.Errorf("failed to create alipay client: %w", err)
	}

	// 加载支付宝公钥用于验签
	if cfg.AlipayPublicKey != "" {
		if err := client.LoadAliPayPublicKey(cfg.AlipayPublicKey); err != nil {
			return nil, fmt.Errorf("failed to load alipay public key: %w", err)
		}
	}

	return &AlipayService{
		client:    client,
		notifyURL: cfg.NotifyURL,
		returnURL: cfg.ReturnURL,
	}, nil
}

// CreateNativePayment 创建扫码支付(当面付)
func (s *AlipayService) CreateNativePayment(ctx context.Context, req *AlipayPaymentRequest) (*AlipayPaymentResponse, error) {
	p := alipay.TradePreCreate{
		Trade: alipay.Trade{
			Subject:     req.Subject,
			OutTradeNo:  req.OrderNo,
			TotalAmount: fmt.Sprintf("%.2f", req.Amount),
			NotifyURL:   s.notifyURL,
		},
	}

	resp, err := s.client.TradePreCreate(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("alipay precreate failed: %w", err)
	}

	if !resp.IsSuccess() {
		return nil, fmt.Errorf("alipay precreate error: %s - %s", resp.SubCode, resp.SubMsg)
	}

	return &AlipayPaymentResponse{
		PaymentNo: req.OrderNo,
		QRCodeURL: resp.QRCode,
	}, nil
}

// CreatePagePayment 创建电脑网站支付(网页跳转)
func (s *AlipayService) CreatePagePayment(ctx context.Context, req *AlipayPaymentRequest) (*AlipayPaymentResponse, error) {
	p := alipay.TradePagePay{
		Trade: alipay.Trade{
			Subject:     req.Subject,
			OutTradeNo:  req.OrderNo,
			TotalAmount: fmt.Sprintf("%.2f", req.Amount),
			ProductCode: "FAST_INSTANT_TRADE_PAY",
			NotifyURL:   s.notifyURL,
			ReturnURL:   s.returnURL,
		},
	}

	payURL, err := s.client.TradePagePay(p)
	if err != nil {
		return nil, fmt.Errorf("alipay page pay failed: %w", err)
	}

	return &AlipayPaymentResponse{
		PaymentNo: req.OrderNo,
		PayURL:    payURL.String(),
	}, nil
}

// CreateWapPayment 创建手机网站支付
func (s *AlipayService) CreateWapPayment(ctx context.Context, req *AlipayPaymentRequest) (*AlipayPaymentResponse, error) {
	p := alipay.TradeWapPay{
		Trade: alipay.Trade{
			Subject:     req.Subject,
			OutTradeNo:  req.OrderNo,
			TotalAmount: fmt.Sprintf("%.2f", req.Amount),
			ProductCode: "QUICK_WAP_WAY",
			NotifyURL:   s.notifyURL,
			ReturnURL:   s.returnURL,
		},
	}

	payURL, err := s.client.TradeWapPay(p)
	if err != nil {
		return nil, fmt.Errorf("alipay wap pay failed: %w", err)
	}

	return &AlipayPaymentResponse{
		PaymentNo: req.OrderNo,
		PayURL:    payURL.String(),
	}, nil
}

// VerifyCallback 验证并解析异步通知
func (s *AlipayService) VerifyCallback(req *http.Request) (*AlipayNotification, error) {
	if err := req.ParseForm(); err != nil {
		return nil, fmt.Errorf("failed to parse form: %w", err)
	}

	// 验证签名
	if err := s.client.VerifySign(req.Form); err != nil {
		return nil, fmt.Errorf("signature verification failed: %w", err)
	}

	// 解析通知数据
	notification := &AlipayNotification{
		TradeNo:     req.Form.Get("trade_no"),
		OutTradeNo:  req.Form.Get("out_trade_no"),
		TradeStatus: req.Form.Get("trade_status"),
		TotalAmount: req.Form.Get("total_amount"),
		BuyerID:     req.Form.Get("buyer_id"),
		GmtPayment:  req.Form.Get("gmt_payment"),
	}

	return notification, nil
}

// QueryOrder 查询订单状态
func (s *AlipayService) QueryOrder(ctx context.Context, orderNo string) (*AlipayQueryResponse, error) {
	p := alipay.TradeQuery{
		OutTradeNo: orderNo,
	}

	resp, err := s.client.TradeQuery(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("alipay query failed: %w", err)
	}

	if !resp.IsSuccess() {
		return nil, fmt.Errorf("alipay query error: %s - %s", resp.SubCode, resp.SubMsg)
	}

	return &AlipayQueryResponse{
		TradeNo:     resp.TradeNo,
		OutTradeNo:  resp.OutTradeNo,
		TradeStatus: string(resp.TradeStatus),
		TotalAmount: resp.TotalAmount,
	}, nil
}

// RefundOrder 申请退款
func (s *AlipayService) RefundOrder(ctx context.Context, req *AlipayRefundRequest) (*AlipayRefundResponse, error) {
	p := alipay.TradeRefund{
		OutTradeNo:   req.OrderNo,
		RefundAmount: fmt.Sprintf("%.2f", req.RefundAmount),
		RefundReason: req.RefundReason,
		OutRequestNo: req.RefundNo, // 部分退款时必填
	}

	resp, err := s.client.TradeRefund(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("alipay refund failed: %w", err)
	}

	if !resp.IsSuccess() {
		return nil, fmt.Errorf("alipay refund error: %s - %s", resp.SubCode, resp.SubMsg)
	}

	return &AlipayRefundResponse{
		RefundNo:     req.RefundNo,
		TradeNo:      resp.TradeNo,
		RefundAmount: resp.RefundFee,
	}, nil
}

// CloseOrder 关闭订单
func (s *AlipayService) CloseOrder(ctx context.Context, orderNo string) error {
	p := alipay.TradeClose{
		OutTradeNo: orderNo,
	}

	resp, err := s.client.TradeClose(ctx, p)
	if err != nil {
		return fmt.Errorf("alipay close failed: %w", err)
	}

	if !resp.IsSuccess() {
		return fmt.Errorf("alipay close error: %s - %s", resp.SubCode, resp.SubMsg)
	}

	return nil
}

// IsPaymentSuccess 判断支付是否成功
func (n *AlipayNotification) IsPaymentSuccess() bool {
	return n.TradeStatus == "TRADE_SUCCESS" || n.TradeStatus == "TRADE_FINISHED"
}

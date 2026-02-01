package services

import (
	"context"
	"crypto/rsa"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/project/backend/config"
	"github.com/wechatpay-apiv3/wechatpay-go/core"
	"github.com/wechatpay-apiv3/wechatpay-go/core/auth/verifiers"
	"github.com/wechatpay-apiv3/wechatpay-go/core/downloader"
	"github.com/wechatpay-apiv3/wechatpay-go/core/notify"
	"github.com/wechatpay-apiv3/wechatpay-go/core/option"
	"github.com/wechatpay-apiv3/wechatpay-go/services/payments"
	"github.com/wechatpay-apiv3/wechatpay-go/services/payments/native"
	"github.com/wechatpay-apiv3/wechatpay-go/services/refunddomestic"
	"github.com/wechatpay-apiv3/wechatpay-go/utils"
)

// WeChatPayService 微信支付服务
type WeChatPayService struct {
	client        *core.Client
	notifyHandler *notify.Handler
	appID         string
	mchID         string
	notifyURL     string
	mchAPIV3Key   string
	privateKey    *rsa.PrivateKey
}

// NativePaymentRequest 原生支付请求
type NativePaymentRequest struct {
	OrderNo       string // 商户订单号
	AmountInCents int64  // 金额(分)
	Description   string // 商品描述
}

// NativePaymentResponse 原生支付响应
type NativePaymentResponse struct {
	PaymentNo  string `json:"paymentNo"`
	QRCodeURL  string `json:"qrcodeUrl"`
	ExpireTime string `json:"expireTime"`
}

// WeChatPayNotification 微信支付通知
type WeChatPayNotification struct {
	OutTradeNo    string    // 商户订单号
	TransactionId string    // 微信支付订单号
	TradeState    string    // 交易状态
	Amount        int64     // 金额(分)
	PayTime       time.Time // 支付时间
	RawData       string    // 原始数据
}

// WeChatQueryResponse 微信查询响应
type WeChatQueryResponse struct {
	OutTradeNo    string
	TransactionId string
	TradeState    string
	Amount        int64
}

// WeChatRefundRequest 微信退款请求
type WeChatRefundRequest struct {
	OrderNo      string // 商户订单号
	RefundNo     string // 商户退款单号
	RefundAmount int64  // 退款金额(分)
	TotalAmount  int64  // 原订单金额(分)
	RefundReason string // 退款原因
}

// WeChatRefundResponse 微信退款响应
type WeChatRefundResponse struct {
	RefundId     string // 微信退款单号
	OutRefundNo  string // 商户退款单号
	RefundStatus string // 退款状态
}

// NewWeChatPayService 创建微信支付服务
func NewWeChatPayService(cfg *config.WeChatPayConfig) (*WeChatPayService, error) {
	if cfg.AppID == "" || cfg.MchID == "" {
		return nil, fmt.Errorf("wechat pay config is incomplete")
	}

	// 读取商户私钥
	privateKey, err := utils.LoadPrivateKeyWithPath(cfg.PrivateKeyPath)
	if err != nil {
		// 如果文件不存在，尝试从环境变量读取
		privateKeyStr := os.Getenv("WECHAT_PAY_PRIVATE_KEY")
		if privateKeyStr != "" {
			privateKey, err = utils.LoadPrivateKey(privateKeyStr)
		}
		if err != nil {
			return nil, fmt.Errorf("failed to load private key: %w", err)
		}
	}

	ctx := context.Background()

	// 创建微信支付客户端
	opts := []core.ClientOption{
		option.WithWechatPayAutoAuthCipher(cfg.MchID, cfg.MchSerialNumber, privateKey, cfg.MchAPIV3Key),
	}

	client, err := core.NewClient(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to create wechat pay client: %w", err)
	}

	// 创建通知处理器（用于验证回调签名）
	// 下载平台证书
	certDownloader, err := downloader.NewCertificateDownloaderWithClient(ctx, client, cfg.MchAPIV3Key)
	if err != nil {
		return nil, fmt.Errorf("failed to create certificate downloader: %w", err)
	}

	notifyHandler, err := notify.NewRSANotifyHandler(cfg.MchAPIV3Key, verifiers.NewSHA256WithRSAVerifier(certDownloader))
	if err != nil {
		return nil, fmt.Errorf("failed to create notify handler: %w", err)
	}

	return &WeChatPayService{
		client:        client,
		notifyHandler: notifyHandler,
		appID:         cfg.AppID,
		mchID:         cfg.MchID,
		notifyURL:     cfg.NotifyURL,
		mchAPIV3Key:   cfg.MchAPIV3Key,
		privateKey:    privateKey,
	}, nil
}

// CreateNativePayment 创建Native支付（扫码支付）
func (s *WeChatPayService) CreateNativePayment(ctx context.Context, req *NativePaymentRequest) (*NativePaymentResponse, error) {
	svc := native.NativeApiService{Client: s.client}

	// 设置订单过期时间（15分钟后）
	expireTime := time.Now().Add(15 * time.Minute)

	resp, _, err := svc.Prepay(ctx, native.PrepayRequest{
		Appid:       core.String(s.appID),
		Mchid:       core.String(s.mchID),
		Description: core.String(req.Description),
		OutTradeNo:  core.String(req.OrderNo),
		TimeExpire:  core.Time(expireTime),
		NotifyUrl:   core.String(s.notifyURL),
		Amount: &native.Amount{
			Total:    core.Int64(req.AmountInCents),
			Currency: core.String("CNY"),
		},
	})

	if err != nil {
		return nil, fmt.Errorf("wechat prepay failed: %w", err)
	}

	return &NativePaymentResponse{
		PaymentNo:  req.OrderNo,
		QRCodeURL:  *resp.CodeUrl,
		ExpireTime: expireTime.Format(time.RFC3339),
	}, nil
}

// VerifyCallback 验证支付回调
func (s *WeChatPayService) VerifyCallback(ctx context.Context, req *http.Request) (*WeChatPayNotification, error) {
	// 解析回调通知
	transaction := new(payments.Transaction)
	_, err := s.notifyHandler.ParseNotifyRequest(ctx, req, transaction)
	if err != nil {
		return nil, fmt.Errorf("parse notify failed: %w", err)
	}

	notification := &WeChatPayNotification{
		OutTradeNo:    *transaction.OutTradeNo,
		TransactionId: *transaction.TransactionId,
		TradeState:    string(*transaction.TradeState),
	}

	if transaction.Amount != nil && transaction.Amount.Total != nil {
		notification.Amount = int64(*transaction.Amount.Total)
	}

	if transaction.SuccessTime != nil {
		payTime, err := time.Parse(time.RFC3339, *transaction.SuccessTime)
		if err != nil {
			return nil, fmt.Errorf("invalid success_time: %w", err)
		}
		notification.PayTime = payTime
	}

	return notification, nil
}

// QueryOrder 查询订单状态
func (s *WeChatPayService) QueryOrder(ctx context.Context, orderNo string) (*WeChatQueryResponse, error) {
	svc := native.NativeApiService{Client: s.client}

	resp, _, err := svc.QueryOrderByOutTradeNo(ctx, native.QueryOrderByOutTradeNoRequest{
		OutTradeNo: core.String(orderNo),
		Mchid:      core.String(s.mchID),
	})

	if err != nil {
		return nil, fmt.Errorf("query order failed: %w", err)
	}

	result := &WeChatQueryResponse{
		OutTradeNo: *resp.OutTradeNo,
		TradeState: string(*resp.TradeState),
	}

	if resp.TransactionId != nil {
		result.TransactionId = *resp.TransactionId
	}

	if resp.Amount != nil && resp.Amount.Total != nil {
		result.Amount = int64(*resp.Amount.Total)
	}

	return result, nil
}

// RefundOrder 申请退款
func (s *WeChatPayService) RefundOrder(ctx context.Context, req *WeChatRefundRequest) (*WeChatRefundResponse, error) {
	svc := refunddomestic.RefundsApiService{Client: s.client}

	resp, _, err := svc.Create(ctx, refunddomestic.CreateRequest{
		OutTradeNo:  core.String(req.OrderNo),
		OutRefundNo: core.String(req.RefundNo),
		Reason:      core.String(req.RefundReason),
		Amount: &refunddomestic.AmountReq{
			Refund:   core.Int64(req.RefundAmount),
			Total:    core.Int64(req.TotalAmount),
			Currency: core.String("CNY"),
		},
	})

	if err != nil {
		return nil, fmt.Errorf("refund failed: %w", err)
	}

	return &WeChatRefundResponse{
		RefundId:     *resp.RefundId,
		OutRefundNo:  *resp.OutRefundNo,
		RefundStatus: string(*resp.Status),
	}, nil
}

// CloseOrder 关闭订单
func (s *WeChatPayService) CloseOrder(ctx context.Context, orderNo string) error {
	svc := native.NativeApiService{Client: s.client}

	_, err := svc.CloseOrder(ctx, native.CloseOrderRequest{
		OutTradeNo: core.String(orderNo),
		Mchid:      core.String(s.mchID),
	})

	if err != nil {
		return fmt.Errorf("close order failed: %w", err)
	}

	return nil
}

// IsPaymentSuccess 判断交易状态是否成功
func (n *WeChatPayNotification) IsPaymentSuccess() bool {
	return n.TradeState == "SUCCESS"
}

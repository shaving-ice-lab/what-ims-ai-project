package database

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/project/backend/config"
	"github.com/redis/go-redis/v9"
)

// Redis 相关常量
const (
	CartKeyPrefix   = "cart"
	CartExpiration  = 30 * 24 * time.Hour // 30天
	DefaultPoolSize = 10
	DefaultTimeout  = 5 * time.Second
	ScanBatchSize   = 100
)

func InitRedis(cfg config.RedisConfig) *redis.Client {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	client := redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password:     cfg.Password,
		DB:           cfg.DB,
		PoolSize:     DefaultPoolSize,
		DialTimeout:  DefaultTimeout,
		ReadTimeout:  DefaultTimeout,
		WriteTimeout: DefaultTimeout,
	})

	// Test connection
	if err := client.Ping(ctx).Err(); err != nil {
		panic("Failed to connect to Redis: " + err.Error())
	}

	return client
}

// CartService Redis购物车服务
type CartService struct {
	client *redis.Client
}

func NewCartService(client *redis.Client) *CartService {
	return &CartService{client: client}
}

// AddToCart 添加到购物车
func (s *CartService) AddToCart(ctx context.Context, storeID, supplierID uint, skuID uint, quantity int, itemData map[string]interface{}) error {
	if ctx == nil {
		ctx = context.Background()
	}

	key := s.buildCartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	data, err := json.Marshal(itemData)
	if err != nil {
		return fmt.Errorf("failed to marshal item data: %w", err)
	}

	if err := s.client.HSet(ctx, key, field, data).Err(); err != nil {
		return fmt.Errorf("failed to add item to cart: %w", err)
	}

	// 设置过期时间
	if err := s.client.Expire(ctx, key, CartExpiration).Err(); err != nil {
		return fmt.Errorf("failed to set cart expiration: %w", err)
	}

	return nil
}

// UpdateQuantity 更新数量
func (s *CartService) UpdateQuantity(ctx context.Context, storeID, supplierID, skuID uint, quantity int) error {
	if ctx == nil {
		ctx = context.Background()
	}

	if quantity == 0 {
		return s.RemoveItem(ctx, storeID, supplierID, skuID)
	}

	if quantity < 0 {
		return errors.New("quantity must be non-negative")
	}

	key := s.buildCartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	// 获取现有数据
	data, err := s.client.HGet(ctx, key, field).Result()
	if err == redis.Nil {
		return errors.New("item not found in cart")
	}
	if err != nil {
		return fmt.Errorf("failed to get cart item: %w", err)
	}

	var itemData map[string]interface{}
	if err := json.Unmarshal([]byte(data), &itemData); err != nil {
		return fmt.Errorf("failed to unmarshal item data: %w", err)
	}

	itemData["quantity"] = quantity
	itemData["updatedAt"] = time.Now().Format(time.RFC3339)

	newData, err := json.Marshal(itemData)
	if err != nil {
		return fmt.Errorf("failed to marshal updated data: %w", err)
	}

	if err := s.client.HSet(ctx, key, field, newData).Err(); err != nil {
		return fmt.Errorf("failed to update cart item: %w", err)
	}

	return nil
}

// RemoveItem 移除商品
func (s *CartService) RemoveItem(ctx context.Context, storeID, supplierID, skuID uint) error {
	if ctx == nil {
		ctx = context.Background()
	}

	key := s.buildCartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	if err := s.client.HDel(ctx, key, field).Err(); err != nil {
		return fmt.Errorf("failed to remove item from cart: %w", err)
	}

	return nil
}

// GetCart 获取购物车（使用 SCAN 避免阻塞）
func (s *CartService) GetCart(ctx context.Context, storeID uint) (map[uint][]map[string]interface{}, error) {
	if ctx == nil {
		ctx = context.Background()
	}

	pattern := fmt.Sprintf("%s:%d:*", CartKeyPrefix, storeID)
	result := make(map[uint][]map[string]interface{})

	// 使用 SCAN 替代 Keys 命令，避免阻塞 Redis
	var cursor uint64
	for {
		keys, nextCursor, err := s.client.Scan(ctx, cursor, pattern, ScanBatchSize).Result()
		if err != nil {
			return nil, fmt.Errorf("failed to scan cart keys: %w", err)
		}

		for _, key := range keys {
			// 解析 supplierID
			var parsedStoreID, supplierID uint
			if _, err := fmt.Sscanf(key, CartKeyPrefix+":%d:%d", &parsedStoreID, &supplierID); err != nil {
				continue
			}

			items, err := s.client.HGetAll(ctx, key).Result()
			if err != nil {
				continue
			}

			var cartItems []map[string]interface{}
			for _, itemStr := range items {
				var item map[string]interface{}
				if err := json.Unmarshal([]byte(itemStr), &item); err == nil {
					cartItems = append(cartItems, item)
				}
			}

			if len(cartItems) > 0 {
				result[supplierID] = cartItems
			}
		}

		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	return result, nil
}

// ClearCart 清空购物车
func (s *CartService) ClearCart(ctx context.Context, storeID, supplierID uint) error {
	if ctx == nil {
		ctx = context.Background()
	}

	key := s.buildCartKey(storeID, supplierID)

	if err := s.client.Del(ctx, key).Err(); err != nil {
		return fmt.Errorf("failed to clear cart: %w", err)
	}

	return nil
}

// GetCartCount 获取购物车商品数量（使用 SCAN 避免阻塞）
func (s *CartService) GetCartCount(ctx context.Context, storeID uint) (int, error) {
	if ctx == nil {
		ctx = context.Background()
	}

	pattern := fmt.Sprintf("%s:%d:*", CartKeyPrefix, storeID)
	total := 0

	// 使用 SCAN 替代 Keys 命令
	var cursor uint64
	for {
		keys, nextCursor, err := s.client.Scan(ctx, cursor, pattern, ScanBatchSize).Result()
		if err != nil {
			return 0, fmt.Errorf("failed to scan cart keys: %w", err)
		}

		for _, key := range keys {
			count, err := s.client.HLen(ctx, key).Result()
			if err == nil {
				total += int(count)
			}
		}

		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	return total, nil
}

// buildCartKey 构建购物车 Redis key
func (s *CartService) buildCartKey(storeID, supplierID uint) string {
	return fmt.Sprintf("%s:%d:%d", CartKeyPrefix, storeID, supplierID)
}

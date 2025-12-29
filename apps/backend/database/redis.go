package database

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/project/backend/config"
)

var ctx = context.Background()

func InitRedis(cfg config.RedisConfig) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: 10,
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
func (s *CartService) AddToCart(storeID, supplierID uint, skuID uint, quantity int, itemData map[string]interface{}) error {
	key := fmt.Sprintf("cart:%d:%d", storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)
	
	data, _ := json.Marshal(itemData)
	err := s.client.HSet(ctx, key, field, data).Err()
	if err != nil {
		return err
	}
	
	// 设置过期时间30天
	s.client.Expire(ctx, key, 30*24*time.Hour)
	return nil
}

// UpdateQuantity 更新数量
func (s *CartService) UpdateQuantity(storeID, supplierID, skuID uint, quantity int) error {
	key := fmt.Sprintf("cart:%d:%d", storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)
	
	if quantity == 0 {
		return s.RemoveItem(storeID, supplierID, skuID)
	}
	
	// 获取现有数据
	data, err := s.client.HGet(ctx, key, field).Result()
	if err != nil {
		return err
	}
	
	var itemData map[string]interface{}
	if err := json.Unmarshal([]byte(data), &itemData); err != nil {
		return err
	}
	
	itemData["quantity"] = quantity
	itemData["updatedAt"] = time.Now().Format(time.RFC3339)
	
	newData, _ := json.Marshal(itemData)
	return s.client.HSet(ctx, key, field, newData).Err()
}

// RemoveItem 移除商品
func (s *CartService) RemoveItem(storeID, supplierID, skuID uint) error {
	key := fmt.Sprintf("cart:%d:%d", storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)
	return s.client.HDel(ctx, key, field).Err()
}

// GetCart 获取购物车
func (s *CartService) GetCart(storeID uint) (map[uint][]map[string]interface{}, error) {
	pattern := fmt.Sprintf("cart:%d:*", storeID)
	keys, err := s.client.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, err
	}
	
	result := make(map[uint][]map[string]interface{})
	
	for _, key := range keys {
		// 解析supplierID
		var supplierID uint
		fmt.Sscanf(key, "cart:%d:%d", &storeID, &supplierID)
		
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
	
	return result, nil
}

// ClearCart 清空购物车
func (s *CartService) ClearCart(storeID, supplierID uint) error {
	key := fmt.Sprintf("cart:%d:%d", storeID, supplierID)
	return s.client.Del(ctx, key).Err()
}

// GetCartCount 获取购物车商品数量
func (s *CartService) GetCartCount(storeID uint) (int, error) {
	pattern := fmt.Sprintf("cart:%d:*", storeID)
	keys, err := s.client.Keys(ctx, pattern).Result()
	if err != nil {
		return 0, err
	}
	
	total := 0
	for _, key := range keys {
		count, err := s.client.HLen(ctx, key).Result()
		if err == nil {
			total += int(count)
		}
	}
	
	return total, nil
}

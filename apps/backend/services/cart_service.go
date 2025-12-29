package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/shopspring/decimal"
)

// CartService handles shopping cart operations using Redis
type CartService struct {
	redis *redis.Client
}

// NewCartService creates a new cart service instance
func NewCartService(redisClient *redis.Client) *CartService {
	return &CartService{
		redis: redisClient,
	}
}

// CartItem represents an item in the shopping cart
type CartItem struct {
	MaterialSkuID uint64          `json:"material_sku_id"`
	Quantity      int             `json:"quantity"`
	Price         decimal.Decimal `json:"price"`
	AddedAt       time.Time       `json:"added_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

// CartExpiration is the default cart expiration time (30 days)
const CartExpiration = 30 * 24 * time.Hour

// cartKey generates the Redis key for a cart
func cartKey(storeID, supplierID uint64) string {
	return fmt.Sprintf("cart:%d:%d", storeID, supplierID)
}

// storeCartsPattern generates the Redis pattern to find all carts for a store
func storeCartsPattern(storeID uint64) string {
	return fmt.Sprintf("cart:%d:*", storeID)
}

// AddToCart adds an item to the cart or updates quantity if exists
func (s *CartService) AddToCart(ctx context.Context, storeID, supplierID, skuID uint64, quantity int, price decimal.Decimal) error {
	key := cartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	// Check if item already exists
	existing, err := s.redis.HGet(ctx, key, field).Result()
	if err != nil && err != redis.Nil {
		return fmt.Errorf("failed to get cart item: %w", err)
	}

	var item CartItem
	now := time.Now()

	if existing != "" {
		// Update existing item
		if err := json.Unmarshal([]byte(existing), &item); err != nil {
			return fmt.Errorf("failed to unmarshal cart item: %w", err)
		}
		item.Quantity += quantity
		item.Price = price
		item.UpdatedAt = now
	} else {
		// Create new item
		item = CartItem{
			MaterialSkuID: skuID,
			Quantity:      quantity,
			Price:         price,
			AddedAt:       now,
			UpdatedAt:     now,
		}
	}

	// Serialize and save
	data, err := json.Marshal(item)
	if err != nil {
		return fmt.Errorf("failed to marshal cart item: %w", err)
	}

	if err := s.redis.HSet(ctx, key, field, string(data)).Err(); err != nil {
		return fmt.Errorf("failed to save cart item: %w", err)
	}

	// Set expiration
	if err := s.redis.Expire(ctx, key, CartExpiration).Err(); err != nil {
		return fmt.Errorf("failed to set cart expiration: %w", err)
	}

	return nil
}

// UpdateQuantity updates the quantity of a cart item
func (s *CartService) UpdateQuantity(ctx context.Context, storeID, supplierID, skuID uint64, quantity int) error {
	key := cartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	// Get existing item
	existing, err := s.redis.HGet(ctx, key, field).Result()
	if err == redis.Nil {
		return fmt.Errorf("cart item not found")
	}
	if err != nil {
		return fmt.Errorf("failed to get cart item: %w", err)
	}

	var item CartItem
	if err := json.Unmarshal([]byte(existing), &item); err != nil {
		return fmt.Errorf("failed to unmarshal cart item: %w", err)
	}

	// Update quantity
	item.Quantity = quantity
	item.UpdatedAt = time.Now()

	// If quantity is 0 or less, remove the item
	if quantity <= 0 {
		return s.RemoveItem(ctx, storeID, supplierID, skuID)
	}

	// Serialize and save
	data, err := json.Marshal(item)
	if err != nil {
		return fmt.Errorf("failed to marshal cart item: %w", err)
	}

	if err := s.redis.HSet(ctx, key, field, string(data)).Err(); err != nil {
		return fmt.Errorf("failed to save cart item: %w", err)
	}

	// Refresh expiration
	if err := s.redis.Expire(ctx, key, CartExpiration).Err(); err != nil {
		return fmt.Errorf("failed to set cart expiration: %w", err)
	}

	return nil
}

// RemoveItem removes an item from the cart
func (s *CartService) RemoveItem(ctx context.Context, storeID, supplierID, skuID uint64) error {
	key := cartKey(storeID, supplierID)
	field := fmt.Sprintf("%d", skuID)

	if err := s.redis.HDel(ctx, key, field).Err(); err != nil {
		return fmt.Errorf("failed to remove cart item: %w", err)
	}

	return nil
}

// GetCart gets all items for a specific supplier cart
func (s *CartService) GetCart(ctx context.Context, storeID, supplierID uint64) ([]CartItem, error) {
	key := cartKey(storeID, supplierID)

	result, err := s.redis.HGetAll(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get cart: %w", err)
	}

	items := make([]CartItem, 0, len(result))
	for _, v := range result {
		var item CartItem
		if err := json.Unmarshal([]byte(v), &item); err != nil {
			continue // Skip invalid items
		}
		items = append(items, item)
	}

	return items, nil
}

// SupplierCart represents a cart for a specific supplier
type SupplierCart struct {
	SupplierID uint64     `json:"supplier_id"`
	Items      []CartItem `json:"items"`
	ItemCount  int        `json:"item_count"`
}

// GetAllCarts gets all supplier carts for a store
func (s *CartService) GetAllCarts(ctx context.Context, storeID uint64) ([]SupplierCart, error) {
	pattern := storeCartsPattern(storeID)

	keys, err := s.redis.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get cart keys: %w", err)
	}

	carts := make([]SupplierCart, 0, len(keys))
	for _, key := range keys {
		// Extract supplier ID from key
		var storeIDFromKey, supplierID uint64
		fmt.Sscanf(key, "cart:%d:%d", &storeIDFromKey, &supplierID)

		items, err := s.GetCart(ctx, storeID, supplierID)
		if err != nil {
			continue // Skip on error
		}

		if len(items) > 0 {
			carts = append(carts, SupplierCart{
				SupplierID: supplierID,
				Items:      items,
				ItemCount:  len(items),
			})
		}
	}

	return carts, nil
}

// ClearCart clears all items from a specific supplier cart
func (s *CartService) ClearCart(ctx context.Context, storeID, supplierID uint64) error {
	key := cartKey(storeID, supplierID)

	if err := s.redis.Del(ctx, key).Err(); err != nil {
		return fmt.Errorf("failed to clear cart: %w", err)
	}

	return nil
}

// GetCartCount gets the total item count across all supplier carts for a store
func (s *CartService) GetCartCount(ctx context.Context, storeID uint64) (int, error) {
	pattern := storeCartsPattern(storeID)

	keys, err := s.redis.Keys(ctx, pattern).Result()
	if err != nil {
		return 0, fmt.Errorf("failed to get cart keys: %w", err)
	}

	totalCount := 0
	for _, key := range keys {
		count, err := s.redis.HLen(ctx, key).Result()
		if err != nil {
			continue
		}
		totalCount += int(count)
	}

	return totalCount, nil
}

// GetCartItemCount gets the total quantity of all items in a store's carts
func (s *CartService) GetCartItemCount(ctx context.Context, storeID uint64) (int, error) {
	carts, err := s.GetAllCarts(ctx, storeID)
	if err != nil {
		return 0, err
	}

	totalQuantity := 0
	for _, cart := range carts {
		for _, item := range cart.Items {
			totalQuantity += item.Quantity
		}
	}

	return totalQuantity, nil
}

// CartSummary represents cart summary information
type CartSummary struct {
	SupplierCount int             `json:"supplier_count"`
	ItemCount     int             `json:"item_count"`
	TotalQuantity int             `json:"total_quantity"`
	TotalAmount   decimal.Decimal `json:"total_amount"`
}

// GetCartSummary gets a summary of the store's cart
func (s *CartService) GetCartSummary(ctx context.Context, storeID uint64) (*CartSummary, error) {
	carts, err := s.GetAllCarts(ctx, storeID)
	if err != nil {
		return nil, err
	}

	summary := &CartSummary{
		SupplierCount: len(carts),
		TotalAmount:   decimal.Zero,
	}

	for _, cart := range carts {
		summary.ItemCount += len(cart.Items)
		for _, item := range cart.Items {
			summary.TotalQuantity += item.Quantity
			summary.TotalAmount = summary.TotalAmount.Add(item.Price.Mul(decimal.NewFromInt(int64(item.Quantity))))
		}
	}

	return summary, nil
}

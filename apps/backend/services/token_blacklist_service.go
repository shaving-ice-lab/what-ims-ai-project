package services

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// TokenBlacklistService handles token blacklist operations using Redis
type TokenBlacklistService struct {
	redis *redis.Client
}

// NewTokenBlacklistService creates a new token blacklist service instance
func NewTokenBlacklistService(redisClient *redis.Client) *TokenBlacklistService {
	return &TokenBlacklistService{
		redis: redisClient,
	}
}

// tokenBlacklistKey generates the Redis key for a blacklisted token
func tokenBlacklistKey(sessionID string) string {
	return fmt.Sprintf("token_blacklist:%s", sessionID)
}

// userSessionsKey generates the Redis key for user sessions
func userSessionsKey(userID uint64) string {
	return fmt.Sprintf("user_sessions:%d", userID)
}

// AddToBlacklist adds a token session to the blacklist
func (s *TokenBlacklistService) AddToBlacklist(ctx context.Context, sessionID string, expiration time.Duration) error {
	key := tokenBlacklistKey(sessionID)

	if err := s.redis.Set(ctx, key, "1", expiration).Err(); err != nil {
		return fmt.Errorf("failed to add token to blacklist: %w", err)
	}

	return nil
}

// IsBlacklisted checks if a token session is blacklisted
func (s *TokenBlacklistService) IsBlacklisted(ctx context.Context, sessionID string) (bool, error) {
	key := tokenBlacklistKey(sessionID)

	exists, err := s.redis.Exists(ctx, key).Result()
	if err != nil {
		return false, fmt.Errorf("failed to check token blacklist: %w", err)
	}

	return exists > 0, nil
}

// RemoveFromBlacklist removes a token session from the blacklist (if needed for admin purposes)
func (s *TokenBlacklistService) RemoveFromBlacklist(ctx context.Context, sessionID string) error {
	key := tokenBlacklistKey(sessionID)

	if err := s.redis.Del(ctx, key).Err(); err != nil {
		return fmt.Errorf("failed to remove token from blacklist: %w", err)
	}

	return nil
}

// AddUserSession tracks a user's active session
func (s *TokenBlacklistService) AddUserSession(ctx context.Context, userID uint64, sessionID string, expiration time.Duration) error {
	key := userSessionsKey(userID)

	// Add session to user's session set
	if err := s.redis.SAdd(ctx, key, sessionID).Err(); err != nil {
		return fmt.Errorf("failed to add user session: %w", err)
	}

	// Set expiration on the set
	if err := s.redis.Expire(ctx, key, expiration).Err(); err != nil {
		return fmt.Errorf("failed to set user sessions expiration: %w", err)
	}

	return nil
}

// RemoveUserSession removes a specific session from user's active sessions
func (s *TokenBlacklistService) RemoveUserSession(ctx context.Context, userID uint64, sessionID string) error {
	key := userSessionsKey(userID)

	if err := s.redis.SRem(ctx, key, sessionID).Err(); err != nil {
		return fmt.Errorf("failed to remove user session: %w", err)
	}

	return nil
}

// GetUserSessions gets all active sessions for a user
func (s *TokenBlacklistService) GetUserSessions(ctx context.Context, userID uint64) ([]string, error) {
	key := userSessionsKey(userID)

	sessions, err := s.redis.SMembers(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get user sessions: %w", err)
	}

	return sessions, nil
}

// InvalidateAllUserSessions invalidates all sessions for a user (logout from all devices)
func (s *TokenBlacklistService) InvalidateAllUserSessions(ctx context.Context, userID uint64, expiration time.Duration) error {
	sessions, err := s.GetUserSessions(ctx, userID)
	if err != nil {
		return err
	}

	// Add all sessions to blacklist
	for _, sessionID := range sessions {
		if err := s.AddToBlacklist(ctx, sessionID, expiration); err != nil {
			return err
		}
	}

	// Clear user sessions set
	key := userSessionsKey(userID)
	if err := s.redis.Del(ctx, key).Err(); err != nil {
		return fmt.Errorf("failed to clear user sessions: %w", err)
	}

	return nil
}

// ClearUserCache clears all cached data for a user
func (s *TokenBlacklistService) ClearUserCache(ctx context.Context, userID uint64) error {
	patterns := []string{
		fmt.Sprintf("user:%d:*", userID),
		fmt.Sprintf("cart:%d:*", userID),
		fmt.Sprintf("permissions:%d", userID),
	}

	for _, pattern := range patterns {
		keys, err := s.redis.Keys(ctx, pattern).Result()
		if err != nil {
			continue // Log but don't fail
		}

		if len(keys) > 0 {
			if err := s.redis.Del(ctx, keys...).Err(); err != nil {
				continue // Log but don't fail
			}
		}
	}

	return nil
}

// Logout performs a complete logout operation
func (s *TokenBlacklistService) Logout(ctx context.Context, userID uint64, sessionID string, tokenExpiration time.Duration) error {
	// Add current session to blacklist
	if err := s.AddToBlacklist(ctx, sessionID, tokenExpiration); err != nil {
		return err
	}

	// Remove from user sessions
	if err := s.RemoveUserSession(ctx, userID, sessionID); err != nil {
		return err
	}

	return nil
}

// LogoutAll performs a complete logout from all devices
func (s *TokenBlacklistService) LogoutAll(ctx context.Context, userID uint64, tokenExpiration time.Duration) error {
	// Invalidate all sessions
	if err := s.InvalidateAllUserSessions(ctx, userID, tokenExpiration); err != nil {
		return err
	}

	// Clear user cache
	if err := s.ClearUserCache(ctx, userID); err != nil {
		return err
	}

	return nil
}

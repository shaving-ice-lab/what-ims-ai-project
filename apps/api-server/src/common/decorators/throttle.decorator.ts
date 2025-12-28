import { Throttle, SkipThrottle } from '@nestjs/throttler';

/**
 * 普通接口限流：100次/分钟
 */
export const ThrottleDefault = () =>
  Throttle({ default: { limit: 100, ttl: 60000 } });

/**
 * 登录接口限流：10次/分钟
 */
export const ThrottleLogin = () =>
  Throttle({ default: { limit: 10, ttl: 60000 } });

/**
 * 验证码接口限流：1次/分钟
 */
export const ThrottleSms = () =>
  Throttle({ default: { limit: 1, ttl: 60000 } });

/**
 * 严格限流：5次/分钟（敏感操作）
 */
export const ThrottleStrict = () =>
  Throttle({ default: { limit: 5, ttl: 60000 } });

/**
 * 宽松限流：500次/分钟（查询接口）
 */
export const ThrottleLoose = () =>
  Throttle({ default: { limit: 500, ttl: 60000 } });

/**
 * 跳过限流
 */
export const NoThrottle = () => SkipThrottle();

export { Throttle, SkipThrottle };

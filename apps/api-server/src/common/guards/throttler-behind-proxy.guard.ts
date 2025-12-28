import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

/**
 * 自定义限流守卫，支持代理后的真实IP获取
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const headers = req.headers as Record<string, string | string[]>;
    const forwarded = headers['x-forwarded-for'];
    const realIp = headers['x-real-ip'];
    const ip = req.ip as string;

    let tracker: string;
    if (forwarded) {
      tracker = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0];
    } else if (realIp) {
      tracker = Array.isArray(realIp) ? realIp[0] : realIp;
    } else {
      tracker = ip || 'unknown';
    }

    return Promise.resolve(tracker.trim());
  }
}

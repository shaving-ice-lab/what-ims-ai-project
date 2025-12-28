import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const getRedisConfig = (configService: ConfigService): Redis => {
  return new Redis({
    host: configService.get<string>('redis.host'),
    port: configService.get<number>('redis.port'),
    password: configService.get<string>('redis.password') || undefined,
    db: configService.get<number>('redis.db'),
    retryStrategy: (times: number) => {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });
};

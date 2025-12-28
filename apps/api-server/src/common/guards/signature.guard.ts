import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

export const REQUIRE_SIGNATURE_KEY = 'requireSignature';

/**
 * 请求签名验证装饰器
 */
export const RequireSignature =
  () => (target: object, key?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(
      REQUIRE_SIGNATURE_KEY,
      true,
      descriptor?.value ?? target,
    );
    return descriptor;
  };

/**
 * 请求签名验证守卫
 * 用于验证供应商API对接时的请求签名
 *
 * 签名规则：
 * 1. 签名内容：timestamp + nonce + body（JSON字符串）
 * 2. 签名算法：HMAC-SHA256
 * 3. Header：X-Signature, X-Timestamp, X-Nonce, X-Api-Key
 */
@Injectable()
export class SignatureGuard implements CanActivate {
  private readonly signatureValiditySeconds = 300; // 签名有效期5分钟

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否需要签名验证
    const requireSignature = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_SIGNATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireSignature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const nonce = request.headers['x-nonce'] as string;
    const apiKey = request.headers['x-api-key'] as string;

    // 验证必要的Header
    if (!signature || !timestamp || !nonce || !apiKey) {
      throw new UnauthorizedException('缺少签名验证必要的Header');
    }

    // 验证时间戳有效性
    const requestTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (
      isNaN(requestTime) ||
      Math.abs(currentTime - requestTime) > this.signatureValiditySeconds
    ) {
      throw new UnauthorizedException('请求时间戳已过期或无效');
    }

    // 获取API密钥对应的密钥
    const apiSecret = await this.getApiSecret(apiKey);
    if (!apiSecret) {
      throw new UnauthorizedException('无效的API密钥');
    }

    // 构建签名内容
    const body = request.body ? JSON.stringify(request.body) : '';
    const signContent = `${timestamp}${nonce}${body}`;

    // 计算签名
    const expectedSignature = this.computeSignature(signContent, apiSecret);

    // 验证签名
    if (signature !== expectedSignature) {
      throw new UnauthorizedException('签名验证失败');
    }

    // 将API信息附加到请求上，供后续使用
    request.apiKey = apiKey;

    return true;
  }

  /**
   * 根据API Key获取对应的Secret
   * 实际应用中应从数据库或缓存中获取
   */
  private async getApiSecret(apiKey: string): Promise<string | null> {
    // TODO: 从数据库或缓存中获取API密钥对应的Secret
    // 这里先使用配置文件中的默认密钥进行演示
    const defaultApiKey = this.configService.get<string>('API_KEY');
    const defaultApiSecret = this.configService.get<string>('API_SECRET');

    if (apiKey === defaultApiKey) {
      return defaultApiSecret || null;
    }

    return null;
  }

  /**
   * 计算HMAC-SHA256签名
   */
  private computeSignature(content: string, secret: string): string {
    return createHmac('sha256', secret).update(content).digest('hex');
  }
}

/**
 * 生成请求签名（供客户端使用的工具函数）
 */
export function generateRequestSignature(
  timestamp: number,
  nonce: string,
  body: string,
  secret: string,
): string {
  const signContent = `${timestamp}${nonce}${body}`;
  return createHmac('sha256', secret).update(signContent).digest('hex');
}

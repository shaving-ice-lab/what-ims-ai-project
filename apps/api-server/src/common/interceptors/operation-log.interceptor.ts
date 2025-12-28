import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationLog, LogOperatorType } from '../../entities';

export const OPERATION_LOG_KEY = 'operationLog';

export interface OperationLogOptions {
  module: string;
  action: string;
  description?: string;
  recordBefore?: boolean;
  recordAfter?: boolean;
}

/**
 * 操作日志装饰器
 * @param options 日志配置选项
 */
export const LogOperation =
  (options: OperationLogOptions) =>
  (target: object, key?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(
      OPERATION_LOG_KEY,
      options,
      descriptor?.value ?? target,
    );
    return descriptor;
  };

/**
 * 操作日志拦截器
 * 自动记录API操作日志
 */
@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @InjectRepository(OperationLog)
    private operationLogRepository: Repository<OperationLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<OperationLogOptions>(
      OPERATION_LOG_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有配置日志选项，直接执行
    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const startTime = Date.now();

    // 记录请求前数据（如果需要）
    const beforeData = options.recordBefore ? { ...request.body } : undefined;

    return next.handle().pipe(
      tap({
        next: async (responseData) => {
          // 记录操作日志
          await this.saveLog({
            options,
            request,
            user,
            beforeData,
            afterData: options.recordAfter ? responseData : undefined,
            duration: Date.now() - startTime,
          });
        },
        error: async (error) => {
          // 即使出错也记录日志
          await this.saveLog({
            options,
            request,
            user,
            beforeData,
            error: error.message,
            duration: Date.now() - startTime,
          });
        },
      }),
    );
  }

  private async saveLog(params: {
    options: OperationLogOptions;
    request: {
      user?: { userId?: number; currentRole?: string; userName?: string };
      ip?: string;
      headers?: Record<string, string>;
      originalUrl?: string;
      method?: string;
      body?: Record<string, unknown>;
      params?: Record<string, unknown>;
    };
    user?: { userId?: number; currentRole?: string; userName?: string };
    beforeData?: Record<string, unknown>;
    afterData?: unknown;
    error?: string;
    duration: number;
  }): Promise<void> {
    const { options, request, user, beforeData, afterData, error } = params;

    try {
      // 提取目标信息
      const targetId = this.extractTargetId(request);

      const log = this.operationLogRepository.create({
        userId: user?.userId,
        userType: this.mapUserType(user?.currentRole),
        userName: user?.userName || '未知用户',
        module: options.module,
        action: options.action,
        targetType: options.module,
        targetId,
        description: error
          ? `${options.description || options.action} - 失败: ${error}`
          : options.description || options.action,
        beforeData: beforeData as Record<string, unknown>,
        afterData: afterData as Record<string, unknown>,
        ipAddress: this.getClientIp(request),
        userAgent: request.headers?.['user-agent'],
        requestUrl: request.originalUrl,
        requestMethod: request.method,
      });

      await this.operationLogRepository.save(log);
    } catch (err) {
      // 日志记录失败不影响主流程
      console.error('操作日志记录失败:', err);
    }
  }

  private mapUserType(role?: string): LogOperatorType | undefined {
    if (!role) return undefined;
    const roleMap: Record<string, LogOperatorType> = {
      admin: LogOperatorType.ADMIN,
      supplier: LogOperatorType.SUPPLIER,
      store: LogOperatorType.STORE,
    };
    return roleMap[role];
  }

  private extractTargetId(request: {
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  }): number | undefined {
    // 从路由参数或请求体中提取目标ID
    const id =
      request.params?.['id'] ||
      request.body?.['id'] ||
      request.params?.['orderId'] ||
      request.body?.['orderId'];
    return id ? Number(id) : undefined;
  }

  private getClientIp(request: {
    ip?: string;
    headers?: Record<string, string>;
  }): string {
    return (
      request.headers?.['x-forwarded-for']?.split(',')[0] ||
      request.headers?.['x-real-ip'] ||
      request.ip ||
      'unknown'
    );
  }
}

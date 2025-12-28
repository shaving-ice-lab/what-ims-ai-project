import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  userId: number;
  username: string;
  currentRole?: 'admin' | 'supplier' | 'store';
  roleId?: number;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);

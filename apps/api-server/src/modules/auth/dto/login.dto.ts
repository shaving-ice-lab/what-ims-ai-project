import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiPropertyOptional({ description: '记住我', default: false })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class SelectRoleDto {
  @ApiProperty({
    description: '角色类型',
    enum: ['admin', 'supplier', 'store'],
    example: 'supplier',
  })
  @IsString()
  @IsNotEmpty()
  role: 'admin' | 'supplier' | 'store';

  @ApiPropertyOptional({ description: '角色ID（供应商ID或门店ID）' })
  @IsOptional()
  roleId?: number;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;

  @ApiProperty({ description: '令牌过期时间（秒）' })
  expiresIn: number;

  @ApiProperty({ description: '用户信息' })
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar?: string;
    roles: Array<{
      role: 'admin' | 'supplier' | 'store';
      roleId?: number;
      roleName?: string;
    }>;
  };

  @ApiPropertyOptional({ description: '当前角色（单角色用户）' })
  currentRole?: {
    role: 'admin' | 'supplier' | 'store';
    roleId?: number;
  };

  @ApiPropertyOptional({ description: '是否需要选择角色（多角色用户）' })
  needSelectRole?: boolean;
}

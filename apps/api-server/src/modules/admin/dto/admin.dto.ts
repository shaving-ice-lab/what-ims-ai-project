import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MinLength,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ description: '用户名', example: 'admin001' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '管理员名称', example: '张三' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: '权限列表',
    example: ['order', 'report'],
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: '管理员名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdatePermissionsDto {
  @ApiProperty({
    description: '权限列表',
    example: ['order', 'report', 'store'],
  })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

export class UpdateStatusDto {
  @ApiProperty({ description: '状态：1启用，0禁用', example: 1 })
  @IsInt()
  @IsNotEmpty()
  status: number;
}

export class ChangePasswordDto {
  @ApiProperty({ description: '旧密码' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class AdminQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ description: '搜索关键词（用户名/名称）' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ description: '状态筛选' })
  @IsOptional()
  status?: number;
}

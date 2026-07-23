import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'nuevo@jurisdiccion.gob.mx' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'María Pérez García' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  displayName?: string;

  @ApiPropertyOptional({ example: 'NuevoPass123' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'EDITOR', 'WRITER', 'VALIDATOR', 'PUBLISHER', 'AUDITOR'] })
  @IsOptional()
  @IsEnum(['ADMIN', 'EDITOR', 'WRITER', 'VALIDATOR', 'PUBLISHER', 'AUDITOR'])
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

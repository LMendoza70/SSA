import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationType, ValidationResult } from '../../generated/prisma/client';

export class ValidationListQueryDto {
  @ApiPropertyOptional({ enum: ValidationType })
  @IsOptional()
  @IsEnum(ValidationType)
  type?: ValidationType;

  @ApiPropertyOptional({ enum: ValidationResult })
  @IsOptional()
  @IsEnum(ValidationResult)
  result?: ValidationResult;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

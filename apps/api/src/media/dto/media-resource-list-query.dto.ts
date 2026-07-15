import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaResourceType } from '@prisma/client';

export class MediaResourceListQueryDto {
  @ApiPropertyOptional({ enum: MediaResourceType })
  @IsOptional()
  @IsEnum(MediaResourceType)
  type?: MediaResourceType;

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

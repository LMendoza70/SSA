import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaResourceType } from '../../generated/prisma/client';

export class UpdateMediaResourceDto {
  @ApiPropertyOptional({ enum: MediaResourceType })
  @IsOptional()
  @IsEnum(MediaResourceType)
  type?: MediaResourceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  altText?: string;
}

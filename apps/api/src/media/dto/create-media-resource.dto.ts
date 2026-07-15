import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaResourceType } from '@prisma/client';

export class CreateMediaResourceDto {
  @ApiProperty({ enum: MediaResourceType })
  @IsEnum(MediaResourceType)
  type!: MediaResourceType;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  altText?: string;
}

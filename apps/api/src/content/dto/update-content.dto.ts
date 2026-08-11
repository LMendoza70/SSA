import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';
import { ContentStatus } from '../../generated/prisma/client';

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @ApiPropertyOptional({ enum: ContentStatus, description: 'Estado editorial' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

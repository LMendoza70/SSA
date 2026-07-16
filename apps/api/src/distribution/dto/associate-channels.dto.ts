import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DistributionStatus } from '../../generated/prisma/client';

export class AssociateChannelsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channelIds?: string[];
}

export class UpdateDistributionDto {
  @ApiPropertyOptional({ enum: DistributionStatus })
  @IsOptional()
  @IsEnum(DistributionStatus)
  status?: DistributionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preparedText?: string;
}

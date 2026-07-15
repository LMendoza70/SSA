import { IsArray, IsString, IsOptional, IsInt, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssociateMediaDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  mediaResourceIds!: string[];
}

export class UpdateAssociationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

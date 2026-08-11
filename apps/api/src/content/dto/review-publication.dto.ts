import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class ReviewPublicationDto {
  @ApiProperty({ enum: ['APPROVED', 'CHANGES_REQUESTED'] })
  @IsIn(['APPROVED', 'CHANGES_REQUESTED'])
  decision!: 'APPROVED' | 'CHANGES_REQUESTED';

  @ApiProperty()
  @IsBoolean()
  informationAccurate!: boolean;

  @ApiProperty()
  @IsBoolean()
  informationCurrent!: boolean;

  @ApiProperty()
  @IsBoolean()
  editorialQuality!: boolean;

  @ApiProperty()
  @IsBoolean()
  mediaAuthorized!: boolean;

  @ApiProperty()
  @IsBoolean()
  institutionalResponsibilityConfirmed!: boolean;

  @ApiPropertyOptional({ description: 'Observaciones obligatorias al solicitar cambios' })
  @ValidateIf((dto: ReviewPublicationDto) => dto.decision === 'CHANGES_REQUESTED' || dto.notes !== undefined)
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsOptional()
  notes?: string;
}

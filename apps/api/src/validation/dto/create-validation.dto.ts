import { IsString, IsOptional, IsEnum, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationType, ValidationResult } from '../../generated/prisma/client';

export class CreateValidationDto {
  @ApiProperty({ enum: ValidationType, description: 'Tipo de validacion' })
  @IsEnum(ValidationType)
  type!: ValidationType;

  @ApiProperty({ enum: ValidationResult, description: 'Resultado de la validacion' })
  @IsEnum(ValidationResult)
  result!: ValidationResult;

  @ApiPropertyOptional({ description: 'ID de la fuente asociada (opcional)' })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiPropertyOptional({ example: 'Documento verificado y vigente' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summary?: string;
}

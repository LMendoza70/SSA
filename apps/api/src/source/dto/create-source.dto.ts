import { IsString, IsOptional, IsBoolean, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SourceType } from '../../generated/prisma/client';

export class CreateSourceDto {
  @ApiProperty({ enum: SourceType, description: 'Tipo de fuente' })
  @IsEnum(SourceType)
  type!: SourceType;

  @ApiProperty({ example: 'Organización Mundial de la Salud' })
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  name!: string;

  @ApiPropertyOptional({ example: 'Documento técnico sobre prevención' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'OMS' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  organization?: string;

  @ApiPropertyOptional({ example: 'https://www.who.int' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Indica si es fuente oficial', default: false })
  @IsOptional()
  @IsBoolean()
  isOfficial?: boolean;
}

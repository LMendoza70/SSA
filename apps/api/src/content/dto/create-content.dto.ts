import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ description: 'ID del ContentType' })
  @IsUUID()
  contentTypeId!: string;

  @ApiProperty({ example: 'Título de la noticia' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title!: string;

  @ApiPropertyOptional({ example: 'Resumen breve del contenido' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @ApiPropertyOptional({ description: 'Cuerpo del contenido (HTML)' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Título SEO' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Descripción SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;
}

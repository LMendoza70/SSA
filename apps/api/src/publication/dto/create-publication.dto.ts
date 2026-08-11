import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublicationDto {
  @ApiPropertyOptional({ description: 'Slug público (se auto-genera del título si se omite)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publicSlug?: string;

  @ApiPropertyOptional({ description: 'Título público (usa el del Content si se omite)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  publicTitle?: string;

  @ApiProperty({ description: 'Responsabilidad institucional que respalda la publicación' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  institutionalResponsibility!: string;
}

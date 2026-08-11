import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaResourceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  resourceUri?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  altText?: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

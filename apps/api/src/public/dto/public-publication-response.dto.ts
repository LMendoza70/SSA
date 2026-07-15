import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PublicContentBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  summary?: string;

  @ApiPropertyOptional()
  body?: string;

  @ApiPropertyOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  seoDescription?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiPropertyOptional()
  contentType?: { id: string; code: string; name: string };
}

export class PublicPublicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  contentId!: string;

  @ApiProperty({ type: PublicContentBrief })
  content!: PublicContentBrief;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  publicSlug!: string;

  @ApiPropertyOptional()
  publicTitle?: string;

  @ApiPropertyOptional()
  publishedAt?: string;

  @ApiProperty()
  isVisible!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

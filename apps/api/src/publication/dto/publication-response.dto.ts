import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ContentBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  status!: string;
}

export class PublicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  contentId!: string;

  @ApiPropertyOptional({ type: ContentBrief })
  content?: ContentBrief;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  publicSlug!: string;

  @ApiPropertyOptional()
  publicTitle?: string;

  @ApiPropertyOptional()
  publishedAt?: string;

  @ApiPropertyOptional()
  withdrawnAt?: string;

  @ApiPropertyOptional()
  archivedAt?: string;

  @ApiProperty()
  isVisible!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

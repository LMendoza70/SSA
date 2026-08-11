import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ContentTypeBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;
}

class UserBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;
}

export class ContentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  contentTypeId!: string;

  @ApiPropertyOptional({ type: ContentTypeBrief })
  contentType?: ContentTypeBrief;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  body?: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ type: UserBrief })
  createdBy?: UserBrief;

  @ApiPropertyOptional({ type: UserBrief })
  updatedBy?: UserBrief;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

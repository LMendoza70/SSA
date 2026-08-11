import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SourceBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  type!: string;
}

class UserBrief {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;
}

export class ValidationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  result!: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  validatedAt?: string;

  @ApiPropertyOptional({ type: SourceBrief })
  source?: SourceBrief;

  @ApiPropertyOptional({ type: UserBrief })
  validatedBy?: UserBrief;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

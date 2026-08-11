import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SourceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  organization?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiProperty()
  isOfficial!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

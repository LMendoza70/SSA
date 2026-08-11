import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PublishToSocialsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publicSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  publicTitle?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  institutionalResponsibility!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channelIds?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  urlImagenTemporal?: string;
}
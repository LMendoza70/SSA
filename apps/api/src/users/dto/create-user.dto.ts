import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'validador@jurisdiccion.gob.mx' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'María Pérez' })
  @IsString()
  @MinLength(2)
  displayName!: string;

  @ApiProperty({ example: 'Temporal123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ['ADMIN', 'EDITOR', 'WRITER', 'VALIDATOR', 'PUBLISHER', 'AUDITOR'], example: 'EDITOR' })
  @IsEnum(['ADMIN', 'EDITOR', 'WRITER', 'VALIDATOR', 'PUBLISHER', 'AUDITOR'])
  role!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

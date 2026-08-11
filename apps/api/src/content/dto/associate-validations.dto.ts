import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssociateValidationsDto {
  @ApiProperty({ description: 'Lista de IDs de validaciones a asociar', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  validationIds!: string[];
}

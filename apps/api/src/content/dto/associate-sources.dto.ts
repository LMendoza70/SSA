import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssociateSourcesDto {
  @ApiProperty({ description: 'Lista de IDs de fuentes a asociar', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  sourceIds!: string[];
}

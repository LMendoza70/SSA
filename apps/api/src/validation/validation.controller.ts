import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ValidationService } from './validation.service';
import { CreateValidationDto, UpdateValidationDto, ValidationListQueryDto, ValidationResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface PaginatedValidationResponse {
  data: ValidationResponseDto[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@ApiTags('Admin / Validations')
@Controller('admin/validations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una validacion institucional' })
  async create(@Body() dto: CreateValidationDto, @Req() req: Request): Promise<ValidationResponseDto> {
    const userId = (req as any).user.id;
    return this.validationService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar validaciones (paginado, filtrado por tipo/resultado)' })
  async findAll(@Query() query: ValidationListQueryDto): Promise<PaginatedValidationResponse> {
    return this.validationService.findAll(query) as Promise<PaginatedValidationResponse>;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener validacion por ID' })
  async findById(@Param('id') id: string): Promise<ValidationResponseDto> {
    return this.validationService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar validacion' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateValidationDto,
    @Req() req: Request,
  ): Promise<ValidationResponseDto> {
    const userId = (req as any).user.id;
    return this.validationService.update(id, dto, userId);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { SourceService } from './source.service';
import { CreateSourceDto, UpdateSourceDto, SourceListQueryDto, SourceResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface PaginatedSourceResponse {
  data: SourceResponseDto[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@ApiTags('Admin / Sources')
@Controller('admin/sources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una fuente' })
  async create(@Body() dto: CreateSourceDto, @Req() req: Request): Promise<SourceResponseDto> {
    const userId = (req as any).user.id;
    return this.sourceService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar fuentes (paginado, filtrado por tipo o busqueda)' })
  async findAll(@Query() query: SourceListQueryDto): Promise<PaginatedSourceResponse> {
    return this.sourceService.findAll(query) as Promise<PaginatedSourceResponse>;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fuente por ID' })
  async findById(@Param('id') id: string): Promise<SourceResponseDto> {
    return this.sourceService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fuente' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSourceDto,
    @Req() req: Request,
  ): Promise<SourceResponseDto> {
    const userId = (req as any).user.id;
    return this.sourceService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fuente (soft delete) si no rompe trazabilidad' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    await this.sourceService.remove(id, userId);
    return { message: 'Fuente eliminada' };
  }
}

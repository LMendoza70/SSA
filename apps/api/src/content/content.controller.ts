import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, ContentListQueryDto, ContentResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Contents')
@Controller('admin/contents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un contenido editorial' })
  async create(@Body() dto: CreateContentDto, @Req() req: Request): Promise<ContentResponseDto> {
    const userId = (req as any).user.id;
    return this.contentService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contenidos (paginado, filtrado)' })
  async findAll(@Query() query: ContentListQueryDto) {
    return this.contentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener contenido por ID' })
  async findById(@Param('id') id: string): Promise<ContentResponseDto> {
    return this.contentService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar contenido (soft delete)' })
  async remove(@Param('id') id: string) {
    await this.contentService.remove(id);
    return { message: 'Contenido eliminado' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar contenido editorial' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
    @Req() req: Request,
  ): Promise<ContentResponseDto> {
    const userId = (req as any).user.id;
    return this.contentService.update(id, dto, userId);
  }
}

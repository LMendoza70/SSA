import { Controller, Get, Post, Patch, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TimelineService } from './timeline.service';
import { CreateTimelineEventDto, UpdateTimelineEventDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Timeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
@Controller('admin/timeline-events')
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Post()
  @ApiOperation({ summary: 'Crear evento de línea del tiempo' })
  async create(@Body() dto: CreateTimelineEventDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos de línea del tiempo' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento de línea del tiempo' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evento de línea del tiempo' })
  async update(@Param('id') id: string, @Body() dto: UpdateTimelineEventDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/media-resources')
  @ApiOperation({ summary: 'Reemplazar recursos multimedia del evento' })
  async replaceMediaResources(
    @Param('id') id: string,
    @Body('mediaResourceIds') mediaResourceIds: string[],
  ) {
    await this.service.replaceMediaResources(id, mediaResourceIds || []);
    return { message: 'Recursos multimedia actualizados' };
  }

  @Patch(':id/media-resources/:mediaResourceId')
  @ApiOperation({ summary: 'Actualizar caption/orden de recurso en el evento' })
  async updateMediaAssociation(
    @Param('id') id: string,
    @Param('mediaResourceId') mediaResourceId: string,
    @Body('caption') caption?: string,
    @Body('sortOrder') sortOrder?: number,
  ) {
    return this.service.updateMediaAssociation(id, mediaResourceId, caption, sortOrder);
  }

  @Put(':id/related-contents')
  @ApiOperation({ summary: 'Reemplazar contenidos relacionados del evento' })
  async replaceRelatedContents(
    @Param('id') id: string,
    @Body('contentIds') contentIds: string[],
  ) {
    await this.service.replaceRelatedContents(id, contentIds || []);
    return { message: 'Contenidos relacionados actualizados' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evento de línea del tiempo' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Evento eliminado' };
  }
}

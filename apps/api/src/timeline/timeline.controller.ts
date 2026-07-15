import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TimelineService } from './timeline.service';
import { CreateTimelineEventDto, UpdateTimelineEventDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Timeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evento de línea del tiempo' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Evento eliminado' };
  }
}

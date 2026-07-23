import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DistributionService } from './distribution.service';
import { CreateChannelDto, UpdateChannelDto, AssociateChannelsDto, UpdateDistributionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Distribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR', 'PUBLISHER')
@Controller('admin')
export class DistributionController {
  constructor(private readonly service: DistributionService) {}

  @Post('communication-channels')
  @ApiOperation({ summary: 'Crear canal de comunicación' })
  async createChannel(@Body() dto: CreateChannelDto) {
    return this.service.createChannel(dto);
  }

  @Get('communication-channels')
  @ApiOperation({ summary: 'Listar canales de comunicación' })
  async findAllChannels() {
    return this.service.findAllChannels();
  }

  @Get('communication-channels/:id')
  @ApiOperation({ summary: 'Obtener canal de comunicación' })
  async findChannelById(@Param('id') id: string) {
    return this.service.findChannelById(id);
  }

  @Patch('communication-channels/:id')
  @ApiOperation({ summary: 'Actualizar canal de comunicación' })
  async updateChannel(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.service.updateChannel(id, dto);
  }

  @Delete('communication-channels/:id')
  @ApiOperation({ summary: 'Eliminar canal de comunicación' })
  async removeChannel(@Param('id') id: string) {
    await this.service.removeChannel(id);
    return { message: 'Canal eliminado' };
  }

  @Get('publications/:publicationId/channels')
  @ApiOperation({ summary: 'Obtener canales asignados a una publicación' })
  async getPublicationChannels(@Param('publicationId') publicationId: string) {
    return this.service.getPublicationChannels(publicationId);
  }

  @Post('publications/:publicationId/channels')
  @ApiOperation({ summary: 'Asociar canales a una publicación' })
  async associatePublicationChannels(
    @Param('publicationId') publicationId: string,
    @Body() dto: AssociateChannelsDto,
  ) {
    return this.service.associatePublicationChannels(publicationId, dto.channelIds || []);
  }

  @Patch('publication-channels/:id/distribution')
  @ApiOperation({ summary: 'Actualizar estado de distribución de un canal' })
  async updateDistribution(
    @Param('id') id: string,
    @Body() dto: UpdateDistributionDto,
  ) {
    return this.service.updateDistribution(id, dto);
  }

  @Post('publication-channels/:id/publish')
  @ApiOperation({ summary: 'Publicar contenido en un canal mediante su adaptador' })
  async publishToChannel(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.service.publishToChannel(id, userId);
  }
}

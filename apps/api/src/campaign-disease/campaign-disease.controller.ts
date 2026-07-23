import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignDiseaseService } from './campaign-disease.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CreateDiseaseDto,
  UpdateDiseaseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Campaigns & Diseases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
@Controller('admin')
export class CampaignDiseaseController {
  constructor(private readonly service: CampaignDiseaseService) {}

  @Post('campaigns')
  @ApiOperation({ summary: 'Crear campaña' })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.service.createCampaign(dto);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Listar campañas' })
  async findAllCampaigns() {
    return this.service.findAllCampaigns();
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Obtener campaña' })
  async findCampaignById(@Param('id') id: string) {
    return this.service.findCampaignById(id);
  }

  @Patch('campaigns/:id')
  @ApiOperation({ summary: 'Actualizar campaña' })
  async updateCampaign(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.service.updateCampaign(id, dto);
  }

  @Delete('campaigns/:id')
  @ApiOperation({ summary: 'Eliminar campaña' })
  async removeCampaign(@Param('id') id: string) {
    await this.service.removeCampaign(id);
    return { message: 'Campaña eliminada' };
  }

  @Post('diseases')
  @ApiOperation({ summary: 'Crear enfermedad' })
  async createDisease(@Body() dto: CreateDiseaseDto) {
    return this.service.createDisease(dto);
  }

  @Get('diseases')
  @ApiOperation({ summary: 'Listar enfermedades' })
  async findAllDiseases() {
    return this.service.findAllDiseases();
  }

  @Get('diseases/:id')
  @ApiOperation({ summary: 'Obtener enfermedad' })
  async findDiseaseById(@Param('id') id: string) {
    return this.service.findDiseaseById(id);
  }

  @Patch('diseases/:id')
  @ApiOperation({ summary: 'Actualizar enfermedad' })
  async updateDisease(@Param('id') id: string, @Body() dto: UpdateDiseaseDto) {
    return this.service.updateDisease(id, dto);
  }

  @Delete('diseases/:id')
  @ApiOperation({ summary: 'Eliminar enfermedad' })
  async removeDisease(@Param('id') id: string) {
    await this.service.removeDisease(id);
    return { message: 'Enfermedad eliminada' };
  }

  @Post('contents/:contentId/campaigns')
  @ApiOperation({ summary: 'Asociar campañas a contenido' })
  async associateCampaigns(@Param('contentId') contentId: string, @Body('campaignIds') campaignIds: string[]) {
    await this.service.associateCampaigns(contentId, campaignIds || []);
    return { message: 'Campañas asociadas' };
  }

  @Get('contents/:contentId/campaigns')
  @ApiOperation({ summary: 'Obtener campañas de un contenido' })
  async getContentCampaigns(@Param('contentId') contentId: string) {
    return this.service.getContentCampaigns(contentId);
  }

  @Post('contents/:contentId/diseases')
  @ApiOperation({ summary: 'Asociar enfermedades a contenido' })
  async associateDiseases(@Param('contentId') contentId: string, @Body('diseaseIds') diseaseIds: string[]) {
    await this.service.associateDiseases(contentId, diseaseIds || []);
    return { message: 'Enfermedades asociadas' };
  }

  @Get('contents/:contentId/diseases')
  @ApiOperation({ summary: 'Obtener enfermedades de un contenido' })
  async getContentDiseases(@Param('contentId') contentId: string) {
    return this.service.getContentDiseases(contentId);
  }

  @Post('campaigns/:campaignId/diseases')
  @ApiOperation({ summary: 'Asociar enfermedades a campaña' })
  async associateCampaignDiseases(@Param('campaignId') campaignId: string, @Body('diseaseIds') diseaseIds: string[]) {
    await this.service.associateCampaignDiseases(campaignId, diseaseIds || []);
    return { message: 'Enfermedades asociadas a campaña' };
  }

  @Get('campaigns/:campaignId/diseases')
  @ApiOperation({ summary: 'Obtener enfermedades de una campaña' })
  async getCampaignDiseases(@Param('campaignId') campaignId: string) {
    return this.service.getCampaignDiseases(campaignId);
  }
}

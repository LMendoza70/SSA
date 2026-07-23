import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Traceability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR', 'AUDITOR')
@Controller('admin/traceability-records')
export class TraceabilityController {
  constructor(private readonly service: TraceabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar registros de trazabilidad (solo lectura, filtrado por contentId, publicationId, sourceId o validationId)' })
  @ApiQuery({ name: 'contentId', required: false })
  @ApiQuery({ name: 'publicationId', required: false })
  @ApiQuery({ name: 'sourceId', required: false })
  @ApiQuery({ name: 'validationId', required: false })
  async find(
    @Query('contentId') contentId?: string,
    @Query('publicationId') publicationId?: string,
    @Query('sourceId') sourceId?: string,
    @Query('validationId') validationId?: string,
  ) {
    if (contentId) return this.service.findByContent(contentId);
    if (publicationId) return this.service.findByPublication(publicationId);
    if (sourceId) return this.service.findBySource(sourceId);
    if (validationId) return this.service.findByValidation(validationId);
    return [];
  }
}

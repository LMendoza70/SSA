import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Traceability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/traceability-records')
export class TraceabilityController {
  constructor(private readonly service: TraceabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar registros de trazabilidad (solo lectura, filtrado por contentId o publicationId)' })
  @ApiQuery({ name: 'contentId', required: false })
  @ApiQuery({ name: 'publicationId', required: false })
  async find(@Query('contentId') contentId?: string, @Query('publicationId') publicationId?: string) {
    if (contentId) {
      return this.service.findByContent(contentId);
    }
    if (publicationId) {
      return this.service.findByPublication(publicationId);
    }
    return [];
  }
}

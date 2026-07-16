import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Content Types')
@Controller('admin/content-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentTypeController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de contenido (con opción ?all=true para ver inactivos)' })
  @ApiQuery({ name: 'all', required: false })
  async findAll(@Query('all') all?: string) {
    return this.contentService.findAllContentTypes(all);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de contenido por ID' })
  async findById(@Param('id') id: string) {
    return this.contentService.findContentTypeById(id);
  }
}

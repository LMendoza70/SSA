import { Controller, Get, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Content Types')
@Controller('admin/content-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentTypeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de contenido (con opción ?all=true para ver inactivos)' })
  @ApiQuery({ name: 'all', required: false })
  async findAll(@Query('all') all?: string) {
    const where: any = { deletedAt: null };
    if (all !== 'true') where.isActive = true;
    return this.prisma.contentType.findMany({ where, orderBy: { name: 'asc' } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de contenido por ID' })
  async findById(@Param('id') id: string) {
    const ct = await this.prisma.contentType.findUnique({ where: { id } });
    if (!ct || ct.deletedAt) {
      throw new NotFoundException('Tipo de contenido no encontrado');
    }
    return ct;
  }
}

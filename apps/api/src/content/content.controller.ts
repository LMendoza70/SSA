import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, ContentListQueryDto, ContentResponseDto, AssociateSourcesDto, AssociateValidationsDto, ReviewPublicationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Contents')
@Controller('admin/contents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR', 'WRITER')
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

  @Post(':id/publication-review')
  @ApiOperation({ summary: 'Revisar contenido mediante checklist antes de su publicación' })
  async reviewForPublication(
    @Param('id') id: string,
    @Body() dto: ReviewPublicationDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    return this.contentService.reviewForPublication(id, dto, userId);
  }

  @Post(':id/sources')
  @ApiOperation({ summary: 'Asociar fuentes a contenido (reemplaza asociaciones existentes)' })
  async associateSources(
    @Param('id') id: string,
    @Body() dto: AssociateSourcesDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    await this.contentService.associateSources(id, dto.sourceIds, userId);
    return this.contentService.findById(id);
  }

  @Delete(':id/sources/:sourceId')
  @ApiOperation({ summary: 'Retirar asociacion de fuente de un contenido' })
  async disassociateSource(
    @Param('id') id: string,
    @Param('sourceId') sourceId: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    await this.contentService.disassociateSource(id, sourceId, userId);
    return this.contentService.findById(id);
  }

  @Post(':id/validations')
  @ApiOperation({ summary: 'Asociar validaciones a contenido (reemplaza asociaciones existentes)' })
  async associateValidations(
    @Param('id') id: string,
    @Body() dto: AssociateValidationsDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    await this.contentService.associateValidations(id, dto.validationIds, userId);
    return this.contentService.findById(id);
  }

  @Delete(':id/validations/:validationId')
  @ApiOperation({ summary: 'Retirar asociacion de validacion de un contenido' })
  async disassociateValidation(
    @Param('id') id: string,
    @Param('validationId') validationId: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    await this.contentService.disassociateValidation(id, validationId, userId);
    return this.contentService.findById(id);
  }
}

import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';
import {
  PublicPublicationListQueryDto,
  PublicPublicationResponseDto,
  PublicSearchQueryDto,
} from './dto';

@Controller('public')
@ApiTags('Public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
  ) {}

  @Get('publications')
  @ApiOperation({ summary: 'Listar publicaciones públicas' })
  async findAll(@Query() query: PublicPublicationListQueryDto) {
    return this.publicService.findAllPublications(query);
  }

  @Get('publications/:slug')
  @ApiOperation({ summary: 'Ver detalle de publicación pública por slug' })
  async findBySlug(@Param('slug') slug: string): Promise<PublicPublicationResponseDto> {
    return this.publicService.findBySlug(slug);
  }

  @Get('featured-publications')
  @ApiOperation({ summary: 'Publicaciones destacadas' })
  async findFeatured() {
    return this.publicService.findFeatured();
  }

  @Get('search')
  @ApiOperation({ summary: 'Búsqueda pública básica' })
  async search(@Query() query: PublicSearchQueryDto) {
    return this.publicService.search(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorías públicas' })
  async publicCategories() {
    return this.publicService.findPublicCategories();
  }

  @Get('categories/:slug/publications')
  @ApiOperation({ summary: 'Publicaciones por categoría' })
  async publicCategoryPublications(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.publicService.findByCategorySlug(slug, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    if (!result) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return result;
  }

  @Get('tags')
  @ApiOperation({ summary: 'Listar etiquetas públicas' })
  async publicTags() {
    return this.publicService.findPublicTags();
  }

  @Get('tags/:slug/publications')
  @ApiOperation({ summary: 'Publicaciones por etiqueta' })
  async publicTagPublications(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.publicService.findByTagSlug(slug, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    if (!result) {
      throw new NotFoundException('Etiqueta no encontrada');
    }
    return result;
  }

  @Get('content-types')
  @ApiOperation({ summary: 'Listar tipos de contenido públicos' })
  async publicContentTypes() {
    return this.publicService.findPublicContentTypes();
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Listar campañas públicas vigentes' })
  async publicCampaigns() {
    return this.publicService.findPublicCampaigns();
  }

  @Get('campaigns/:slug')
  @ApiOperation({ summary: 'Ver detalle de campaña pública por slug' })
  async publicCampaignBySlug(@Param('slug') slug: string) {
    return this.publicService.findPublicCampaignBySlug(slug);
  }

  @Get('diseases')
  @ApiOperation({ summary: 'Listar enfermedades públicas' })
  async publicDiseases() {
    return this.publicService.findPublicDiseases();
  }

  @Get('diseases/:slug')
  @ApiOperation({ summary: 'Ver detalle de enfermedad pública por slug' })
  async publicDiseaseBySlug(@Param('slug') slug: string) {
    return this.publicService.findPublicDiseaseBySlug(slug);
  }

  @Get('timeline-events')
  @ApiOperation({ summary: 'Listar eventos públicos de línea del tiempo' })
  async publicTimelineEvents() {
    return this.publicService.findPublicTimelineEvents();
  }

  @Get('timeline-events/:slug')
  @ApiOperation({ summary: 'Ver detalle de evento de línea del tiempo por slug' })
  async publicTimelineEventBySlug(@Param('slug') slug: string) {
    return this.publicService.findPublicTimelineEventBySlug(slug);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Listar fuentes públicas activas' })
  async publicSources() {
    return this.publicService.findAllSources();
  }

  @Get('media-resources/:id')
  @ApiOperation({ summary: 'Consultar metadatos públicos de un recurso multimedia' })
  async publicMediaResource(@Param('id') id: string) {
    return this.publicService.findMediaResource(id);
  }

  @Get('timeline-events/:slug/media-resources')
  @ApiOperation({ summary: 'Recursos multimedia de un evento histórico' })
  async publicTimelineEventMediaResources(@Param('slug') slug: string) {
    return this.publicService.findTimelineEventMediaResources(slug);
  }

  @Get('timeline-events/:slug/related-publications')
  @ApiOperation({ summary: 'Publicaciones relacionadas a un evento histórico' })
  async publicTimelineEventRelatedPublications(@Param('slug') slug: string) {
    return this.publicService.findTimelineEventRelatedPublications(slug);
  }

  @Get('media/by-content/:contentId')
  @ApiOperation({ summary: 'Obtener recursos multimedia de un contenido' })
  async getContentMedia(@Param('contentId') contentId: string) {
    return this.publicService.findContentMedia(contentId);
  }
}

import { Controller, Get, Param, Query, Inject, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { StorageProvider } from '../media/storage-provider.interface';
import { PrismaService } from '../prisma/prisma.service';
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
    @Inject('STORAGE_PROVIDER') private readonly storage: StorageProvider,
    private readonly prisma: PrismaService,
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
    return this.prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Get('tags')
  @ApiOperation({ summary: 'Listar etiquetas públicas' })
  async publicTags() {
    return this.prisma.tag.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Get('content-types')
  @ApiOperation({ summary: 'Listar tipos de contenido públicos' })
  async publicContentTypes() {
    return this.prisma.contentType.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Listar campañas públicas vigentes' })
  async publicCampaigns() {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { startsAt: null },
          { startsAt: { lte: now } },
        ],
        AND: [
          { OR: [ { endsAt: null }, { endsAt: { gte: now } } ] },
        ],
      },
      orderBy: { startsAt: { sort: 'desc', nulls: 'last' } },
    });
  }

  @Get('campaigns/:slug')
  @ApiOperation({ summary: 'Ver detalle de campaña pública por slug' })
  async publicCampaignBySlug(@Param('slug') slug: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
    });
    if (!campaign || campaign.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }
    return campaign;
  }

  @Get('diseases')
  @ApiOperation({ summary: 'Listar enfermedades públicas' })
  async publicDiseases() {
    return this.prisma.disease.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Get('diseases/:slug')
  @ApiOperation({ summary: 'Ver detalle de enfermedad pública por slug' })
  async publicDiseaseBySlug(@Param('slug') slug: string) {
    const disease = await this.prisma.disease.findUnique({
      where: { slug },
    });
    if (!disease || disease.deletedAt) {
      throw new NotFoundException('Enfermedad no encontrada');
    }
    return disease;
  }

  @Get('timeline-events')
  @ApiOperation({ summary: 'Listar eventos públicos de línea del tiempo' })
  async publicTimelineEvents() {
    const events = await this.prisma.timelineEvent.findMany({
      where: {
        isVisible: true,
        deletedAt: null,
      },
      orderBy: { occurredAt: 'desc' },
      include: {
        timelineEventMediaResources: {
          include: { mediaResource: true },
          orderBy: { sortOrder: 'asc' },
        },
        timelineEventContents: {
          include: { content: { select: { id: true, title: true, slug: true } } },
        },
      },
    });

    return events.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      occurredAt: e.occurredAt?.toISOString(),
      periodLabel: e.periodLabel,
      historicalRelevance: e.historicalRelevance,
      mediaResources: e.timelineEventMediaResources.map((em) => ({
        id: em.mediaResource.id,
        type: em.mediaResource.type,
        title: em.mediaResource.title,
        url: em.mediaResource.resourceUri
          ? this.storage.getUrl(em.mediaResource.resourceUri)
          : em.mediaResource.externalUrl,
        altText: em.mediaResource.altText,
        caption: em.caption,
      })),
      relatedContents: e.timelineEventContents.map((ec) => ec.content),
    }));
  }

  @Get('timeline-events/:slug')
  @ApiOperation({ summary: 'Ver detalle de evento de línea del tiempo por slug' })
  async publicTimelineEventBySlug(@Param('slug') slug: string) {
    const event = await this.prisma.timelineEvent.findUnique({
      where: { slug },
      include: {
        timelineEventMediaResources: {
          include: { mediaResource: true },
          orderBy: { sortOrder: 'asc' },
        },
        timelineEventContents: {
          include: {
            content: {
              select: { id: true, title: true, slug: true, summary: true, contentType: { select: { id: true, code: true, name: true } } },
            },
          },
        },
      },
    });

    if (!event || event.deletedAt || !event.isVisible) {
      throw new NotFoundException('Evento no encontrado');
    }

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      occurredAt: event.occurredAt?.toISOString(),
      periodLabel: event.periodLabel,
      historicalRelevance: event.historicalRelevance,
      mediaResources: event.timelineEventMediaResources.map((em) => ({
        id: em.mediaResource.id,
        type: em.mediaResource.type,
        title: em.mediaResource.title,
        url: em.mediaResource.resourceUri
          ? this.storage.getUrl(em.mediaResource.resourceUri)
          : em.mediaResource.externalUrl,
        altText: em.mediaResource.altText,
        caption: em.caption,
      })),
      relatedContents: event.timelineEventContents.map((ec) => ec.content),
    };
  }

  @Get('media/by-content/:contentId')
  @ApiOperation({ summary: 'Obtener recursos multimedia de un contenido' })
  async getContentMedia(@Param('contentId') contentId: string) {
    const associations = await this.prisma.contentMediaResource.findMany({
      where: { contentId },
      include: { mediaResource: true },
      orderBy: { sortOrder: 'asc' },
    });

    return associations.map((a) => ({
      id: a.mediaResource.id,
      type: a.mediaResource.type,
      title: a.mediaResource.title,
      description: a.mediaResource.description,
      url: a.mediaResource.resourceUri
        ? this.storage.getUrl(a.mediaResource.resourceUri)
        : a.mediaResource.externalUrl,
      mimeType: a.mediaResource.mimeType,
      altText: a.mediaResource.altText,
      caption: a.caption,
      sortOrder: a.sortOrder,
    }));
  }
}

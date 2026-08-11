import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageProvider } from '../media/storage-provider.interface';
import { PublicPublicationListQueryDto, PublicSearchQueryDto } from './dto';
import { PublicationStatus } from '../generated/prisma/client';

const PUBLIC_STATUSES: PublicationStatus[] = [
  PublicationStatus.PUBLISHED,
  PublicationStatus.UPDATED,
  PublicationStatus.HISTORICALLY_CONTEXTUALIZED,
];

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('STORAGE_PROVIDER') private readonly storage: StorageProvider,
  ) {}

  private resolveMediaUrl(resource: { resourceUri: string | null; externalUrl: string | null }): string | null {
    return resource.resourceUri ? this.storage.getUrl(resource.resourceUri) : resource.externalUrl;
  }

  async findAllPublications(query: PublicPublicationListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      status: { in: PUBLIC_STATUSES },
      isVisible: true,
      content: { deletedAt: null },
    };

    if (query.contentTypeCode) {
      where.content.contentType = { code: query.contentTypeCode };
    }

    if (query.categoryId) {
      where.content.contentCategories = { some: { categoryId: query.categoryId } };
    }

    if (query.tagId) {
      where.content.contentTags = { some: { tagId: query.tagId } };
    }

    const [items, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              summary: true,
              body: true,
              seoTitle: true,
              seoDescription: true,
              createdAt: true,
              updatedAt: true,
              contentType: { select: { id: true, code: true, name: true } },
            },
          },
        },
      }),
      this.prisma.publication.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toPublicResponse(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByCategorySlug(slug: string, query: { page?: number; limit?: number }) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category || category.deletedAt) return null;
    return {
      category: { id: category.id, name: category.name, slug: category.slug },
      ...(await this.findAllPublications({ ...query, categoryId: category.id })),
    };
  }

  async findByTagSlug(slug: string, query: { page?: number; limit?: number }) {
    const tag = await this.prisma.tag.findUnique({ where: { slug } });
    if (!tag || tag.deletedAt) return null;
    return {
      tag: { id: tag.id, name: tag.name, slug: tag.slug },
      ...(await this.findAllPublications({ ...query, tagId: tag.id })),
    };
  }

  async findBySlug(slug: string) {
    const publication = await this.prisma.publication.findFirst({
      where: {
        publicSlug: slug,
        deletedAt: null,
        status: { in: PUBLIC_STATUSES },
        isVisible: true,
        content: { deletedAt: null },
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            summary: true,
            body: true,
            seoTitle: true,
            seoDescription: true,
            createdAt: true,
            updatedAt: true,
            contentType: { select: { id: true, code: true, name: true } },
            contentCategories: {
              include: { category: { select: { id: true, name: true, slug: true } } },
            },
            contentTags: {
              include: { tag: { select: { id: true, name: true, slug: true } } },
            },
            contentMediaResources: {
              include: { mediaResource: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const base = this.toPublicResponse(publication);
    const content = publication.content as any;
    return {
      ...base,
      categories: (content.contentCategories || []).map((cc: any) => cc.category),
      tags: (content.contentTags || []).map((ct: any) => ct.tag),
      mediaResources: (content.contentMediaResources || []).map((cm: any) => ({
        id: cm.mediaResource.id,
        type: cm.mediaResource.type,
        title: cm.mediaResource.title,
        description: cm.mediaResource.description,
        url: this.resolveMediaUrl(cm.mediaResource),
        mimeType: cm.mediaResource.mimeType,
        altText: cm.mediaResource.altText,
        caption: cm.caption,
        sortOrder: cm.sortOrder,
      })),
    };
  }

  async findFeatured() {
    const items = await this.prisma.publication.findMany({
      where: {
        deletedAt: null,
        status: { in: PUBLIC_STATUSES },
        isVisible: true,
        content: { deletedAt: null },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            summary: true,
            body: true,
            seoTitle: true,
            seoDescription: true,
            createdAt: true,
            updatedAt: true,
            contentType: { select: { id: true, code: true, name: true } },
          },
        },
      },
    });

    return items.map((item) => this.toPublicResponse(item));
  }

  async search(query: PublicSearchQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      status: { in: PUBLIC_STATUSES },
      isVisible: true,
      content: { deletedAt: null },
      OR: [
        { publicTitle: { contains: query.q, mode: 'insensitive' } },
        {
          content: {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { summary: { contains: query.q, mode: 'insensitive' } },
              { body: { contains: query.q, mode: 'insensitive' } },
            ],
          },
        },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              summary: true,
              body: true,
              seoTitle: true,
              seoDescription: true,
              createdAt: true,
              updatedAt: true,
              contentType: { select: { id: true, code: true, name: true } },
            },
          },
        },
      }),
      this.prisma.publication.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toPublicResponse(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllSources() {
    return this.prisma.source.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
        organization: true,
        url: true,
        isOfficial: true,
      },
    });
  }

  async findMediaResource(id: string) {
    const resource = await this.prisma.mediaResource.findUnique({
      where: { id },
    });

    if (!resource || !resource.isActive || resource.deletedAt) {
      throw new NotFoundException('Recurso no encontrado');
    }

    return {
      id: resource.id,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      mimeType: resource.mimeType,
      altText: resource.altText,
      url: this.resolveMediaUrl(resource),
    };
  }

  async findPublicCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findPublicTags() {
    return this.prisma.tag.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findPublicContentTypes() {
    return this.prisma.contentType.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findPublicCampaigns() {
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

  async findPublicCampaignBySlug(slug: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { slug } });
    if (!campaign || campaign.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }
    return campaign;
  }

  async findPublicDiseases() {
    return this.prisma.disease.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findPublicDiseaseBySlug(slug: string) {
    const disease = await this.prisma.disease.findUnique({ where: { slug } });
    if (!disease || disease.deletedAt) {
      throw new NotFoundException('Enfermedad no encontrada');
    }
    return disease;
  }

  async findPublicTimelineEvents() {
    const events = await this.prisma.timelineEvent.findMany({
      where: { isVisible: true, deletedAt: null },
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
        url: this.resolveMediaUrl(em.mediaResource),
        altText: em.mediaResource.altText,
        caption: em.caption,
        sortOrder: em.sortOrder,
      })),
      relatedContents: e.timelineEventContents.map((ec) => ec.content),
    }));
  }

  async findPublicTimelineEventBySlug(slug: string) {
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
        url: this.resolveMediaUrl(em.mediaResource),
        altText: em.mediaResource.altText,
        caption: em.caption,
        sortOrder: em.sortOrder,
      })),
      relatedContents: event.timelineEventContents.map((ec) => ec.content),
    };
  }

  async findTimelineEventMediaResources(slug: string) {
    const event = await this.prisma.timelineEvent.findUnique({
      where: { slug },
      select: { id: true, deletedAt: true, isVisible: true },
    });
    if (!event || event.deletedAt || !event.isVisible) {
      throw new NotFoundException('Evento no encontrado');
    }
    const associations = await this.prisma.timelineEventMediaResource.findMany({
      where: { timelineEventId: event.id },
      include: { mediaResource: true },
      orderBy: { sortOrder: 'asc' },
    });
    return associations.map((em) => ({
      id: em.mediaResource.id,
      type: em.mediaResource.type,
      title: em.mediaResource.title,
      description: em.mediaResource.description,
      url: this.resolveMediaUrl(em.mediaResource),
      mimeType: em.mediaResource.mimeType,
      altText: em.mediaResource.altText,
      caption: em.caption,
      sortOrder: em.sortOrder,
    }));
  }

  async findTimelineEventRelatedPublications(slug: string) {
    const event = await this.prisma.timelineEvent.findUnique({
      where: { slug },
      select: { id: true, deletedAt: true, isVisible: true },
    });
    if (!event || event.deletedAt || !event.isVisible) {
      throw new NotFoundException('Evento no encontrado');
    }
    const associations = await this.prisma.timelineEventContent.findMany({
      where: { timelineEventId: event.id },
      include: {
        content: {
          select: { id: true, title: true, slug: true, summary: true },
        },
      },
    });
    return associations.map((ec) => ec.content);
  }

  async findContentMedia(contentId: string) {
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
      url: this.resolveMediaUrl(a.mediaResource),
      mimeType: a.mediaResource.mimeType,
      altText: a.mediaResource.altText,
      caption: a.caption,
      sortOrder: a.sortOrder,
    }));
  }

  private toPublicResponse(publication: any) {
    return {
      id: publication.id,
      contentId: publication.contentId,
      content: {
        id: publication.content.id,
        title: publication.content.title,
        summary: publication.content.summary,
        body: publication.content.body,
        seoTitle: publication.content.seoTitle,
        seoDescription: publication.content.seoDescription,
        createdAt: publication.content.createdAt.toISOString(),
        updatedAt: publication.content.updatedAt.toISOString(),
        contentType: publication.content.contentType,
      },
      status: publication.status,
      publicSlug: publication.publicSlug,
      publicTitle: publication.publicTitle,
      institutionalResponsibility: publication.institutionalResponsibility,
      publishedAt: publication.publishedAt?.toISOString(),
      updatedAtPublic: publication.updatedAtPublic?.toISOString(),
      isVisible: publication.isVisible,
      createdAt: publication.createdAt.toISOString(),
      updatedAt: publication.updatedAt.toISOString(),
    };
  }
}

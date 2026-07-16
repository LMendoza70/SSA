import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicPublicationListQueryDto, PublicSearchQueryDto } from './dto';
import { PublicationStatus } from '../generated/prisma/client';

const PUBLIC_STATUSES: PublicationStatus[] = [
  PublicationStatus.PUBLISHED,
  PublicationStatus.UPDATED,
  PublicationStatus.HISTORICALLY_CONTEXTUALIZED,
];

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

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
        url: cm.mediaResource.resourceUri ?? cm.mediaResource.externalUrl,
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
      resourceUri: resource.resourceUri,
      externalUrl: resource.externalUrl,
      mimeType: resource.mimeType,
      altText: resource.altText,
    };
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

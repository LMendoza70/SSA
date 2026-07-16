import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicPublicationListQueryDto, PublicSearchQueryDto } from './dto';
import { PublicationStatus } from '../generated/prisma/client';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublications(query: PublicPublicationListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      status: PublicationStatus.PUBLISHED,
      isVisible: true,
    };

    if (query.contentTypeCode) {
      where.content = {
        contentType: { code: query.contentTypeCode },
      };
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

  async findBySlug(slug: string) {
    const publication = await this.prisma.publication.findFirst({
      where: {
        publicSlug: slug,
        deletedAt: null,
        status: PublicationStatus.PUBLISHED,
        isVisible: true,
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
          },
        },
      },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return this.toPublicResponse(publication);
  }

  async findFeatured() {
    const items = await this.prisma.publication.findMany({
      where: {
        deletedAt: null,
        status: PublicationStatus.PUBLISHED,
        isVisible: true,
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
      status: PublicationStatus.PUBLISHED,
      isVisible: true,
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
      publishedAt: publication.publishedAt?.toISOString(),
      isVisible: publication.isVisible,
      createdAt: publication.createdAt.toISOString(),
      updatedAt: publication.updatedAt.toISOString(),
    };
  }
}

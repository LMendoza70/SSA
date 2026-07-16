import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineEventDto, UpdateTimelineEventDto } from './dto';
import sanitizeHtml from 'sanitize-html';

function slugify(text: string): string {
  return text
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimelineEventDto) {
    const slug = slugify(dto.title);
    const event = await this.prisma.timelineEvent.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ? sanitizeHtml(dto.description) : undefined,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
        periodLabel: dto.periodLabel,
        historicalRelevance: dto.historicalRelevance,
        isVisible: dto.isVisible ?? true,
        timelineEventMediaResources: dto.mediaResourceIds?.length
          ? { create: dto.mediaResourceIds.map((id) => ({ mediaResourceId: id })) }
          : undefined,
        timelineEventContents: dto.contentIds?.length
          ? { create: dto.contentIds.map((id) => ({ contentId: id })) }
          : undefined,
      },
    });
    return event;
  }

  async findAll() {
    return this.prisma.timelineEvent.findMany({
      where: { deletedAt: null },
      orderBy: { occurredAt: 'desc' },
      include: {
        timelineEventMediaResources: {
          include: { mediaResource: true },
        },
        timelineEventContents: {
          include: { content: { select: { id: true, title: true, slug: true } } },
        },
      },
    });
  }

  async findById(id: string) {
    const event = await this.prisma.timelineEvent.findUnique({
      where: { id },
      include: {
        timelineEventMediaResources: {
          include: { mediaResource: true },
        },
        timelineEventContents: {
          include: { content: { select: { id: true, title: true, slug: true } } },
        },
      },
    });
    if (!event || event.deletedAt) {
      throw new NotFoundException('Evento de línea del tiempo no encontrado');
    }
    return event;
  }

  async update(id: string, dto: UpdateTimelineEventDto) {
    const existing = await this.prisma.timelineEvent.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Evento de línea del tiempo no encontrado');
    }

    const data: any = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
      data.slug = slugify(dto.title);
    }
    if (dto.description !== undefined) data.description = sanitizeHtml(dto.description);
    if (dto.occurredAt !== undefined) data.occurredAt = new Date(dto.occurredAt);
    if (dto.periodLabel !== undefined) data.periodLabel = dto.periodLabel;
    if (dto.historicalRelevance !== undefined) data.historicalRelevance = dto.historicalRelevance;
    if (dto.isVisible !== undefined) data.isVisible = dto.isVisible;

    const event = await this.prisma.$transaction(async (tx) => {
      if (dto.mediaResourceIds !== undefined) {
        await tx.timelineEventMediaResource.deleteMany({ where: { timelineEventId: id } });
        if (dto.mediaResourceIds.length > 0) {
          await tx.timelineEventMediaResource.createMany({
            data: dto.mediaResourceIds.map((mediaResourceId) => ({ timelineEventId: id, mediaResourceId })),
          });
        }
      }
      if (dto.contentIds !== undefined) {
        await tx.timelineEventContent.deleteMany({ where: { timelineEventId: id } });
        if (dto.contentIds.length > 0) {
          await tx.timelineEventContent.createMany({
            data: dto.contentIds.map((contentId) => ({ timelineEventId: id, contentId })),
          });
        }
      }
      return tx.timelineEvent.update({
        where: { id },
        data,
        include: {
          timelineEventMediaResources: {
            include: { mediaResource: true },
          },
          timelineEventContents: {
            include: { content: { select: { id: true, title: true, slug: true } } },
          },
        },
      });
    });

    return event;
  }

  async replaceMediaResources(eventId: string, mediaResourceIds: string[]) {
    const event = await this.prisma.timelineEvent.findUnique({ where: { id: eventId } });
    if (!event || event.deletedAt) {
      throw new NotFoundException('Evento de línea del tiempo no encontrado');
    }

    for (const id of mediaResourceIds) {
      const mr = await this.prisma.mediaResource.findUnique({ where: { id } });
      if (!mr || mr.deletedAt) {
        throw new BadRequestException(`Recurso multimedia ${id} no encontrado`);
      }
    }

    await this.prisma.$transaction([
      this.prisma.timelineEventMediaResource.deleteMany({ where: { timelineEventId: eventId } }),
      ...mediaResourceIds.map((mediaResourceId, i) =>
        this.prisma.timelineEventMediaResource.create({
          data: { timelineEventId: eventId, mediaResourceId, sortOrder: i },
        }),
      ),
    ]);
  }

  async replaceRelatedContents(eventId: string, contentIds: string[]) {
    const event = await this.prisma.timelineEvent.findUnique({ where: { id: eventId } });
    if (!event || event.deletedAt) {
      throw new NotFoundException('Evento de línea del tiempo no encontrado');
    }

    for (const id of contentIds) {
      const c = await this.prisma.content.findUnique({ where: { id } });
      if (!c || c.deletedAt) {
        throw new BadRequestException(`Contenido ${id} no encontrado`);
      }
    }

    await this.prisma.$transaction([
      this.prisma.timelineEventContent.deleteMany({ where: { timelineEventId: eventId } }),
      ...contentIds.map((contentId) =>
        this.prisma.timelineEventContent.create({
          data: { timelineEventId: eventId, contentId },
        }),
      ),
    ]);
  }

  async updateMediaAssociation(eventId: string, mediaResourceId: string, caption?: string, sortOrder?: number) {
    const association = await this.prisma.timelineEventMediaResource.findUnique({
      where: { timelineEventId_mediaResourceId: { timelineEventId: eventId, mediaResourceId } },
    });
    if (!association) {
      throw new NotFoundException('Asociación no encontrada');
    }

    const data: any = {};
    if (caption !== undefined) data.caption = caption;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    return this.prisma.timelineEventMediaResource.update({
      where: { timelineEventId_mediaResourceId: { timelineEventId: eventId, mediaResourceId } },
      data,
      include: { mediaResource: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.timelineEvent.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Evento de línea del tiempo no encontrado');
    }
    await this.prisma.timelineEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

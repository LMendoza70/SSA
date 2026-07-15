import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineEventDto, UpdateTimelineEventDto } from './dto';

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
        description: dto.description,
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
    if (dto.description !== undefined) data.description = dto.description;
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

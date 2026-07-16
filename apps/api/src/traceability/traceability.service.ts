import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TraceabilityAction } from '../generated/prisma/client';

@Injectable()
export class TraceabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async record(params: {
    action: TraceabilityAction;
    userId: string;
    contentId?: string;
    publicationId?: string;
    summary?: string;
  }) {
    return this.prisma.traceabilityRecord.create({
      data: {
        action: params.action,
        userId: params.userId,
        contentId: params.contentId,
        publicationId: params.publicationId,
        summary: params.summary,
      },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    });
  }

  async findByContent(contentId: string) {
    return this.prisma.traceabilityRecord.findMany({
      where: { contentId },
      orderBy: { occurredAt: 'desc' },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    });
  }

  async findByPublication(publicationId: string) {
    return this.prisma.traceabilityRecord.findMany({
      where: { publicationId },
      orderBy: { occurredAt: 'desc' },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    });
  }
}

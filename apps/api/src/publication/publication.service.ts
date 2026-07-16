import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto, PublicationListQueryDto } from './dto';
import { TraceabilityService } from '../traceability/traceability.service';
import { PublicationStatus } from '../generated/prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

@Injectable()
export class PublicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(contentId: string, dto: CreatePublicationDto, userId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: {
        publication: true,
        contentSources: { include: { source: { select: { id: true, name: true } } } },
        contentValidations: {
          include: { validation: { select: { id: true, type: true, result: true } } },
        },
      },
    });

    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    if (content.publication) {
      throw new ConflictException('Este contenido ya tiene una publicación');
    }

    if (content.status !== 'READY_FOR_PUBLICATION') {
      throw new BadRequestException(
        'El contenido debe estar en estado READY_FOR_PUBLICATION para publicarse',
      );
    }

    if (!content.contentSources || content.contentSources.length === 0) {
      throw new BadRequestException(
        'El contenido debe tener al menos una fuente asociada para publicarse',
      );
    }

    if (!content.contentValidations || content.contentValidations.length === 0) {
      throw new BadRequestException(
        'El contenido debe tener al menos una validación asociada para publicarse',
      );
    }

    const hasApprovedValidation = content.contentValidations.some(
      (cv) => cv.validation.result === 'APPROVED',
    );
    if (!hasApprovedValidation) {
      throw new BadRequestException(
        'El contenido debe tener al menos una validación aprobada para publicarse',
      );
    }

    if (!dto.institutionalResponsibility || dto.institutionalResponsibility.trim().length < 10) {
      throw new BadRequestException(
        'Debe especificar la responsabilidad institucional que respalda la publicación',
      );
    }

    const baseSlug = dto.publicSlug || slugify(dto.publicTitle || content.title);
    const publicSlug = await this.resolveUniqueSlug(baseSlug);

    const publication = await this.prisma.publication.create({
      data: {
        contentId,
        publicSlug,
        publicTitle: dto.publicTitle || content.title,
        status: PublicationStatus.PUBLISHED,
        institutionalResponsibility: dto.institutionalResponsibility,
        publishedAt: new Date(),
        isVisible: true,
      },
      include: {
        content: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    await this.traceability.record({
      action: 'PUBLISHED',
      userId,
      contentId: content.id,
      publicationId: publication.id,
      summary: `Publicación "${publication.publicTitle}" publicada bajo responsabilidad: ${dto.institutionalResponsibility}`,
    });

    return this.toResponse(publication);
  }

  async findAll(query: PublicationListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          content: {
            select: { id: true, title: true, slug: true, status: true },
          },
        },
      }),
      this.prisma.publication.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        content: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return this.toResponse(publication);
  }

  async withdraw(id: string, userId: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.status !== PublicationStatus.PUBLISHED) {
      throw new BadRequestException('Solo se puede retirar una publicación activa');
    }

    const updated = await this.prisma.publication.update({
      where: { id },
      data: {
        status: PublicationStatus.WITHDRAWN,
        withdrawnAt: new Date(),
        isVisible: false,
      },
      include: {
        content: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    await this.traceability.record({
      action: 'WITHDRAWN',
      userId,
      contentId: updated.contentId,
      publicationId: updated.id,
      summary: `Publicación "${updated.publicTitle}" retirada`,
    });

    return this.toResponse(updated);
  }

  async archive(id: string, userId: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.status === PublicationStatus.ARCHIVED) {
      throw new BadRequestException('La publicación ya está archivada');
    }

    const updated = await this.prisma.publication.update({
      where: { id },
      data: {
        status: PublicationStatus.ARCHIVED,
        archivedAt: new Date(),
        isVisible: false,
      },
      include: {
        content: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    await this.traceability.record({
      action: 'ARCHIVED',
      userId,
      contentId: updated.contentId,
      publicationId: updated.id,
      summary: `Publicación "${updated.publicTitle}" archivada`,
    });

    return this.toResponse(updated);
  }

  private async resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug || 'publicacion';
    let counter = 0;

    while (true) {
      const candidate = counter === 0 ? slug : `${slug}-${counter}`;
      const existing = await this.prisma.publication.findUnique({
        where: { publicSlug: candidate },
        select: { id: true },
      });
      if (!existing || (excludeId && existing.id === excludeId)) {
        return candidate;
      }
      counter++;
    }
  }

  private toResponse(publication: any) {
    return {
      id: publication.id,
      contentId: publication.contentId,
      content: publication.content,
      status: publication.status,
      publicSlug: publication.publicSlug,
      publicTitle: publication.publicTitle,
      institutionalResponsibility: publication.institutionalResponsibility,
      publishedAt: publication.publishedAt?.toISOString(),
      withdrawnAt: publication.withdrawnAt?.toISOString(),
      archivedAt: publication.archivedAt?.toISOString(),
      isVisible: publication.isVisible,
      createdAt: publication.createdAt.toISOString(),
      updatedAt: publication.updatedAt.toISOString(),
    };
  }
}

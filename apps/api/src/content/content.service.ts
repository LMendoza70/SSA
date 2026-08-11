import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto, UpdateContentDto, ContentListQueryDto, ReviewPublicationDto } from './dto';
import { TraceabilityService } from '../traceability/traceability.service';
import sanitizeHtml from 'sanitize-html';

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'figure', 'figcaption', 'span', 'sub', 'sup',
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height', 'style'],
    '*': ['style', 'class'],
  },
};

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
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(dto: CreateContentDto, userId: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { id: dto.contentTypeId },
    });
    if (!contentType) {
      throw new NotFoundException('ContentType no encontrado');
    }

    const baseSlug = slugify(dto.title);
    const slug = await this.resolveUniqueSlug(baseSlug);

    const content = await this.prisma.content.create({
      data: {
        contentTypeId: dto.contentTypeId,
        title: dto.title,
        slug,
        summary: dto.summary ? sanitizeHtml(dto.summary, SANITIZE_CONFIG) : undefined,
        body: dto.body ? sanitizeHtml(dto.body, SANITIZE_CONFIG) : undefined,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        createdById: userId,
        updatedById: userId,
      },
      include: {
        contentType: { select: { id: true, code: true, name: true } },
        createdBy: { select: { id: true, displayName: true } },
        updatedBy: { select: { id: true, displayName: true } },
      },
    });

    await this.traceability.record({
      action: 'CREATED',
      userId,
      contentId: content.id,
      summary: `Contenido "${content.title}" creado`,
    });

    return this.toResponse(content);
  }

  async findAll(query: ContentListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }
    if (query.contentTypeId) {
      where.contentTypeId = query.contentTypeId;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contentType: { select: { id: true, code: true, name: true } },
          createdBy: { select: { id: true, displayName: true } },
          updatedBy: { select: { id: true, displayName: true } },
        },
      }),
      this.prisma.content.count({ where }),
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
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        contentType: { select: { id: true, code: true, name: true } },
        createdBy: { select: { id: true, displayName: true } },
        updatedBy: { select: { id: true, displayName: true } },
        contentSources: {
          include: { source: { select: { id: true, name: true, type: true, organization: true } } },
        },
        publicationReview: {
          include: { reviewedBy: { select: { id: true, displayName: true } } },
        },
      },
    });

    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    return this.toResponse(content);
  }

  async update(id: string, dto: UpdateContentDto, userId: string) {
    const existing = await this.prisma.content.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    const data: any = { updatedById: userId };

    if (dto.title !== undefined) {
      data.title = dto.title;
      const baseSlug = slugify(dto.title);
      if (baseSlug !== existing.slug) {
        data.slug = await this.resolveUniqueSlug(baseSlug, id);
      }
    }
    if (dto.contentTypeId !== undefined) {
      const contentType = await this.prisma.contentType.findUnique({
        where: { id: dto.contentTypeId },
      });
      if (!contentType) {
        throw new NotFoundException('ContentType no encontrado');
      }
      data.contentTypeId = dto.contentTypeId;
    }
    if (dto.summary !== undefined) data.summary = sanitizeHtml(dto.summary, SANITIZE_CONFIG);
    if (dto.body !== undefined) data.body = sanitizeHtml(dto.body, SANITIZE_CONFIG);
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) data.seoDescription = dto.seoDescription;
    if (dto.status === 'READY_FOR_PUBLICATION') {
      throw new BadRequestException('El estado READY_FOR_PUBLICATION solo se asigna mediante la revisión de publicación');
    }
    if (dto.status !== undefined) data.status = dto.status;

    const content = await this.prisma.content.update({
      where: { id },
      data,
      include: {
        contentType: { select: { id: true, code: true, name: true } },
        createdBy: { select: { id: true, displayName: true } },
        updatedBy: { select: { id: true, displayName: true } },
      },
    });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      contentId: id,
      summary: `Contenido "${content.title}" actualizado`,
    });

    const changesEditorialContent = dto.title !== undefined || dto.contentTypeId !== undefined ||
      dto.summary !== undefined || dto.body !== undefined || dto.seoTitle !== undefined || dto.seoDescription !== undefined;
    if (changesEditorialContent) {
      const review = await this.prisma.publicationReview.findUnique({ where: { contentId: id } });
      if (review?.isCurrent && review.decision === 'APPROVED') {
        await this.prisma.$transaction([
          this.prisma.content.update({ where: { id }, data: { status: 'NEEDS_REVIEW' } }),
          this.prisma.publicationReview.update({ where: { contentId: id }, data: { isCurrent: false } }),
        ]);
        await this.traceability.record({
          action: 'CHANGES_REQUESTED',
          userId,
          contentId: id,
          summary: 'La aprobación anterior fue invalidada porque el contenido fue actualizado',
        });
      }
    }

    if (dto.status && dto.status !== existing.status) {
      await this.traceability.record({
        action: dto.status === 'PREPARED' ? 'PREPARED' : 'UPDATED',
        userId,
        contentId: id,
        summary: `Estado cambiado de ${existing.status} a ${dto.status}`,
      });
    }

    return this.toResponse(content);
  }

  async findAllContentTypes(all?: string) {
    const where: { deletedAt: null; isActive?: boolean } = { deletedAt: null };
    if (all !== 'true') where.isActive = true;
    return this.prisma.contentType.findMany({ where, orderBy: { name: 'asc' as const } });
  }

  async reviewForPublication(id: string, dto: ReviewPublicationDto, userId: string) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');
    if (content.status === 'ARCHIVED') throw new BadRequestException('No se puede revisar un contenido archivado');

    const checklistComplete = dto.informationAccurate && dto.informationCurrent && dto.editorialQuality &&
      dto.mediaAuthorized && dto.institutionalResponsibilityConfirmed;
    if (dto.decision === 'APPROVED' && !checklistComplete) {
      throw new BadRequestException('Todos los elementos del checklist deben confirmarse para aprobar la publicación');
    }
    if (dto.decision === 'CHANGES_REQUESTED' && (!dto.notes || dto.notes.trim().length < 10)) {
      throw new BadRequestException('Indica una observación de al menos 10 caracteres al solicitar cambios');
    }

    const approved = dto.decision === 'APPROVED';
    await this.prisma.$transaction([
      this.prisma.content.update({ where: { id }, data: { status: approved ? 'READY_FOR_PUBLICATION' : 'NEEDS_REVIEW', updatedById: userId } }),
      this.prisma.publicationReview.upsert({
        where: { contentId: id },
        create: { contentId: id, reviewedById: userId, decision: dto.decision, informationAccurate: dto.informationAccurate, informationCurrent: dto.informationCurrent, editorialQuality: dto.editorialQuality, mediaAuthorized: dto.mediaAuthorized, institutionalResponsibilityConfirmed: dto.institutionalResponsibilityConfirmed, notes: dto.notes?.trim(), isCurrent: true },
        update: { reviewedById: userId, decision: dto.decision, informationAccurate: dto.informationAccurate, informationCurrent: dto.informationCurrent, editorialQuality: dto.editorialQuality, mediaAuthorized: dto.mediaAuthorized, institutionalResponsibilityConfirmed: dto.institutionalResponsibilityConfirmed, notes: dto.notes?.trim(), reviewedAt: new Date(), isCurrent: true, deletedAt: null },
      }),
    ]);
    await this.traceability.record({
      action: approved ? 'APPROVED_FOR_PUBLICATION' : 'CHANGES_REQUESTED', userId, contentId: id,
      summary: approved ? `Contenido "${content.title}" aprobado para publicación` : `Cambios solicitados para "${content.title}": ${dto.notes?.trim()}`,
    });
    return this.findById(id);
  }

  async findContentTypeById(id: string) {
    const ct = await this.prisma.contentType.findUnique({ where: { id } });
    if (!ct || ct.deletedAt) {
      throw new NotFoundException('Tipo de contenido no encontrado');
    }
    return ct;
  }

  async remove(id: string) {
    const existing = await this.prisma.content.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }
    await this.prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async associateSources(contentId: string, sourceIds: string[], userId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    const validSources = await this.prisma.source.findMany({
      where: { id: { in: sourceIds }, deletedAt: null },
      select: { id: true, name: true },
    });

    if (validSources.length !== sourceIds.length) {
      throw new NotFoundException('Una o mas fuentes no encontradas');
    }

    await this.prisma.contentSource.deleteMany({ where: { contentId } });

    if (sourceIds.length > 0) {
      await this.prisma.contentSource.createMany({
        data: sourceIds.map((sourceId) => ({ contentId, sourceId })),
      });
    }

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      contentId,
      summary: `Fuentes actualizadas: ${validSources.map((s) => s.name).join(', ') || 'ninguna'}`,
    });
  }

  async disassociateSource(contentId: string, sourceId: string, userId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    const link = await this.prisma.contentSource.findUnique({
      where: { contentId_sourceId: { contentId, sourceId } },
    });
    if (!link) throw new NotFoundException('La fuente no esta asociada a este contenido');

    await this.prisma.contentSource.delete({ where: { id: link.id } });

    const source = await this.prisma.source.findUnique({ where: { id: sourceId } });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      contentId,
      summary: `Fuente "${source?.name || sourceId}" retirada del contenido`,
    });
  }

  async associateValidations(contentId: string, validationIds: string[], userId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    const validVals = await this.prisma.validation.findMany({
      where: { id: { in: validationIds }, deletedAt: null },
      select: { id: true, type: true },
    });

    if (validVals.length !== validationIds.length) {
      throw new NotFoundException('Una o mas validaciones no encontradas');
    }

    await this.prisma.contentValidation.deleteMany({ where: { contentId } });

    if (validationIds.length > 0) {
      await this.prisma.contentValidation.createMany({
        data: validationIds.map((validationId) => ({ contentId, validationId })),
      });
    }

    await this.traceability.record({
      action: 'VALIDATED',
      userId,
      contentId,
      summary: `Validaciones actualizadas: ${validVals.map((v) => v.type).join(', ') || 'ninguna'}`,
    });
  }

  async disassociateValidation(contentId: string, validationId: string, userId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    const link = await this.prisma.contentValidation.findUnique({
      where: { contentId_validationId: { contentId, validationId } },
    });
    if (!link) throw new NotFoundException('La validacion no esta asociada a este contenido');

    await this.prisma.contentValidation.delete({ where: { id: link.id } });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      contentId,
      summary: `Validacion retirada del contenido`,
    });
  }

  private async resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug || 'sin-titulo';
    let counter = 0;

    while (true) {
      const candidate = counter === 0 ? slug : `${slug}-${counter}`;
      const existing = await this.prisma.content.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!existing || (excludeId && existing.id === excludeId)) {
        return candidate;
      }
      counter++;
    }
  }

  private toResponse(content: any) {
    return {
      id: content.id,
      contentTypeId: content.contentTypeId,
      contentType: content.contentType,
      title: content.title,
      slug: content.slug,
      summary: content.summary,
      body: content.body,
      status: content.status,
      seoTitle: content.seoTitle,
      seoDescription: content.seoDescription,
      createdBy: content.createdBy,
      updatedBy: content.updatedBy,
      sources: content.contentSources?.map((cs: any) => ({
        id: cs.source.id,
        name: cs.source.name,
        type: cs.source.type,
        organization: cs.source.organization,
      })) ?? [],
      publicationReview: content.publicationReview ? {
        decision: content.publicationReview.decision,
        informationAccurate: content.publicationReview.informationAccurate,
        informationCurrent: content.publicationReview.informationCurrent,
        editorialQuality: content.publicationReview.editorialQuality,
        mediaAuthorized: content.publicationReview.mediaAuthorized,
        institutionalResponsibilityConfirmed: content.publicationReview.institutionalResponsibilityConfirmed,
        notes: content.publicationReview.notes,
        reviewedAt: content.publicationReview.reviewedAt.toISOString(),
        isCurrent: content.publicationReview.isCurrent,
        reviewedBy: content.publicationReview.reviewedBy,
      } : undefined,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    };
  }
}

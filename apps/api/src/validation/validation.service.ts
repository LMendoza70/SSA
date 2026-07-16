import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { CreateValidationDto, UpdateValidationDto, ValidationListQueryDto } from './dto';

@Injectable()
export class ValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(dto: CreateValidationDto, userId: string) {
    if (dto.sourceId) {
      const source = await this.prisma.source.findUnique({ where: { id: dto.sourceId } });
      if (!source || source.deletedAt) {
        throw new NotFoundException('Fuente asociada no encontrada');
      }
    }

    const validation = await this.prisma.validation.create({
      data: {
        type: dto.type,
        result: dto.result,
        sourceId: dto.sourceId,
        summary: dto.summary,
        validatedById: userId,
        validatedAt: new Date(),
      },
      include: {
        source: { select: { id: true, name: true, type: true } },
        validatedBy: { select: { id: true, displayName: true } },
      },
    });

    await this.traceability.record({
      action: 'VALIDATED',
      userId,
      validationId: validation.id,
      sourceId: dto.sourceId,
      summary: `Validacion ${dto.type} registrada con resultado ${dto.result}`,
    });

    return this.toResponse(validation);
  }

  async findAll(query: ValidationListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.type) where.type = query.type;
    if (query.result) where.result = query.result;
    if (query.search) {
      where.OR = [
        { summary: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.validation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          source: { select: { id: true, name: true, type: true } },
          validatedBy: { select: { id: true, displayName: true } },
        },
      }),
      this.prisma.validation.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const validation = await this.prisma.validation.findUnique({
      where: { id },
      include: {
        source: { select: { id: true, name: true, type: true } },
        validatedBy: { select: { id: true, displayName: true } },
      },
    });
    if (!validation || validation.deletedAt) {
      throw new NotFoundException('Validacion no encontrada');
    }
    return this.toResponse(validation);
  }

  async update(id: string, dto: UpdateValidationDto, userId: string) {
    const existing = await this.prisma.validation.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Validacion no encontrada');
    }

    if (dto.sourceId) {
      const source = await this.prisma.source.findUnique({ where: { id: dto.sourceId } });
      if (!source || source.deletedAt) {
        throw new NotFoundException('Fuente asociada no encontrada');
      }
    }

    const validation = await this.prisma.validation.update({
      where: { id },
      data: {
        type: dto.type,
        result: dto.result,
        sourceId: dto.sourceId,
        summary: dto.summary,
      },
      include: {
        source: { select: { id: true, name: true, type: true } },
        validatedBy: { select: { id: true, displayName: true } },
      },
    });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      validationId: id,
      summary: `Validacion actualizada`,
    });

    return this.toResponse(validation);
  }

  private toResponse(validation: any) {
    return {
      id: validation.id,
      type: validation.type,
      result: validation.result,
      summary: validation.summary,
      validatedAt: validation.validatedAt?.toISOString(),
      source: validation.source ?? undefined,
      validatedBy: validation.validatedBy ?? undefined,
      createdAt: validation.createdAt.toISOString(),
      updatedAt: validation.updatedAt.toISOString(),
    };
  }
}

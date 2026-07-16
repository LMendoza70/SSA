import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { CreateSourceDto, UpdateSourceDto, SourceListQueryDto } from './dto';

@Injectable()
export class SourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(dto: CreateSourceDto, userId: string) {
    const source = await this.prisma.source.create({
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description,
        organization: dto.organization,
        url: dto.url,
        isOfficial: dto.isOfficial ?? false,
      },
    });

    await this.traceability.record({
      action: 'CREATED',
      userId,
      sourceId: source.id,
      summary: `Fuente "${source.name}" creada`,
    });

    return this.toResponse(source);
  }

  async findAll(query: SourceListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.type) {
      where.type = query.type;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { organization: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.source.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.source.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const source = await this.prisma.source.findUnique({ where: { id } });
    if (!source || source.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }
    return this.toResponse(source);
  }

  async update(id: string, dto: UpdateSourceDto, userId: string) {
    const existing = await this.prisma.source.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }

    const source = await this.prisma.source.update({
      where: { id },
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description,
        organization: dto.organization,
        url: dto.url,
        isOfficial: dto.isOfficial,
      },
    });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      sourceId: id,
      summary: `Fuente "${source.name}" actualizada`,
    });

    return this.toResponse(source);
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.source.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }

    await this.prisma.source.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.traceability.record({
      action: 'ARCHIVED',
      userId,
      sourceId: id,
      summary: `Fuente "${existing.name}" eliminada logicamente`,
    });
  }

  private toResponse(source: any) {
    return {
      id: source.id,
      type: source.type,
      name: source.name,
      description: source.description,
      organization: source.organization,
      url: source.url,
      isOfficial: source.isOfficial,
      createdAt: source.createdAt.toISOString(),
      updatedAt: source.updatedAt.toISOString(),
    };
  }
}

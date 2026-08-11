import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TraceabilityService } from '../traceability/traceability.service';
import { Source } from '../generated/prisma/client';
import { CreateSourceDto, UpdateSourceDto, SourceListQueryDto } from './dto';
import { ISourceRepository } from './source.repository.interface';

interface SourceResponse {
  id: string;
  type: string;
  name: string;
  description?: string;
  organization?: string;
  url?: string;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class SourceService {
  constructor(
    @Inject('ISourceRepository') private readonly sourceRepository: ISourceRepository,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(dto: CreateSourceDto, userId: string): Promise<SourceResponse> {
    const source = await this.sourceRepository.create({
      type: dto.type,
      name: dto.name,
      description: dto.description,
      organization: dto.organization,
      url: dto.url,
      isOfficial: dto.isOfficial ?? false,
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

    const where: Parameters<ISourceRepository['findMany']>[0]['where'] = {};

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

    const { items, total } = await this.sourceRepository.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } });

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<SourceResponse> {
    const source = await this.sourceRepository.findUnique({ id });
    if (!source || source.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }
    return this.toResponse(source);
  }

  async update(id: string, dto: UpdateSourceDto, userId: string): Promise<SourceResponse> {
    const existing = await this.sourceRepository.findUnique({ id });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }

    const source = await this.sourceRepository.update(id, {
      type: dto.type,
      name: dto.name,
      description: dto.description,
      organization: dto.organization,
      url: dto.url,
      isOfficial: dto.isOfficial,
    });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      sourceId: id,
      summary: `Fuente "${source.name}" actualizada`,
    });

    return this.toResponse(source);
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.sourceRepository.findUnique({ id });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Fuente no encontrada');
    }

    await this.sourceRepository.softDelete(id);

    await this.traceability.record({
      action: 'ARCHIVED',
      userId,
      sourceId: id,
      summary: `Fuente "${existing.name}" eliminada logicamente`,
    });
  }

  private toResponse(source: Source): SourceResponse {
    return {
      id: source.id,
      type: source.type,
      name: source.name,
      description: source.description ?? undefined,
      organization: source.organization ?? undefined,
      url: source.url ?? undefined,
      isOfficial: source.isOfficial,
      createdAt: source.createdAt.toISOString(),
      updatedAt: source.updatedAt.toISOString(),
    };
  }
}

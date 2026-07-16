import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TraceabilityService } from '../traceability/traceability.service';
import { Validation } from '../generated/prisma/client';
import { CreateValidationDto, UpdateValidationDto, ValidationListQueryDto } from './dto';
import { IValidationRepository, ValidationWithRelations } from './validation.repository.interface';

interface ValidationResponse {
  id: string;
  type: string;
  result: string;
  summary?: string;
  validatedAt?: string;
  source?: { id: string; name: string; type: string };
  validatedBy?: { id: string; displayName: string };
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ValidationService {
  constructor(
    @Inject('IValidationRepository') private readonly validationRepository: IValidationRepository,
    private readonly traceability: TraceabilityService,
  ) {}

  async create(dto: CreateValidationDto, userId: string): Promise<ValidationResponse> {
    if (dto.sourceId) {
      const sourceExists = await this.validationRepository.existsSource(dto.sourceId);
      if (!sourceExists) {
        throw new NotFoundException('Fuente asociada no encontrada');
      }
    }

    const validation = await this.validationRepository.create({
      type: dto.type,
      result: dto.result,
      sourceId: dto.sourceId,
      summary: dto.summary,
      validatedById: userId,
      validatedAt: new Date(),
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

    const where: Parameters<IValidationRepository['findMany']>[0]['where'] = {};

    if (query.type) where.type = query.type;
    if (query.result) where.result = query.result;
    if (query.search) {
      where.OR = [
        { summary: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await this.validationRepository.findMany({ where: { ...where }, skip, take: limit, orderBy: { createdAt: 'desc' } });

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<ValidationResponse> {
    const validation = await this.validationRepository.findUnique({ id });
    if (!validation || validation.deletedAt) {
      throw new NotFoundException('Validacion no encontrada');
    }
    return this.toResponse(validation);
  }

  async update(id: string, dto: UpdateValidationDto, userId: string): Promise<ValidationResponse> {
    const existing = await this.validationRepository.findUnique({ id });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Validacion no encontrada');
    }

    if (dto.sourceId) {
      const sourceExists = await this.validationRepository.existsSource(dto.sourceId);
      if (!sourceExists) {
        throw new NotFoundException('Fuente asociada no encontrada');
      }
    }

    const validation = await this.validationRepository.update(id, {
      type: dto.type,
      result: dto.result,
      sourceId: dto.sourceId,
      summary: dto.summary,
    });

    await this.traceability.record({
      action: 'UPDATED',
      userId,
      validationId: id,
      summary: `Validacion actualizada`,
    });

    return this.toResponse(validation);
  }

  private toResponse(validation: ValidationWithRelations): ValidationResponse {
    return {
      id: validation.id,
      type: validation.type,
      result: validation.result,
      summary: validation.summary ?? undefined,
      validatedAt: validation.validatedAt?.toISOString(),
      source: validation.source || undefined,
      validatedBy: validation.validatedBy || undefined,
      createdAt: validation.createdAt.toISOString(),
      updatedAt: validation.updatedAt.toISOString(),
    };
  }
}

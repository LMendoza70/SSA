import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationType, ValidationResult } from '../generated/prisma/client';
import {
  IValidationRepository,
  ValidationFindManyParams,
  PaginatedResult,
  ValidationWithRelations,
} from './validation.repository.interface';

const VALIDATION_INCLUDE = {
  source: { select: { id: true, name: true, type: true } },
  validatedBy: { select: { id: true, displayName: true } },
} as const;

@Injectable()
export class PrismaValidationRepository implements IValidationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    type: ValidationType;
    result: ValidationResult;
    sourceId?: string;
    summary?: string;
    validatedById: string;
    validatedAt: Date;
  }): Promise<ValidationWithRelations> {
    return this.prisma.validation.create({
      data,
      include: VALIDATION_INCLUDE,
    });
  }

  async findMany(params: ValidationFindManyParams): Promise<PaginatedResult<ValidationWithRelations>> {
    const where = { deletedAt: null, ...params.where };

    const [items, total] = await Promise.all([
      this.prisma.validation.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy,
        include: VALIDATION_INCLUDE,
      }),
      this.prisma.validation.count({ where }),
    ]);

    return { items, total };
  }

  async findUnique(where: { id: string }): Promise<ValidationWithRelations | null> {
    return this.prisma.validation.findUnique({
      where,
      include: VALIDATION_INCLUDE,
    });
  }

  async update(
    id: string,
    data: {
      type?: ValidationType;
      result?: ValidationResult;
      sourceId?: string;
      summary?: string;
    },
  ): Promise<ValidationWithRelations> {
    return this.prisma.validation.update({
      where: { id },
      data,
      include: VALIDATION_INCLUDE,
    });
  }

  async existsSource(sourceId: string): Promise<boolean> {
    const source = await this.prisma.source.findUnique({ where: { id: sourceId } });
    return !!source && !source.deletedAt;
  }
}

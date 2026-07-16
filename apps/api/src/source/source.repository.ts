import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Source, SourceType } from '../generated/prisma/client';
import { ISourceRepository, SourceFindManyParams, PaginatedResult } from './source.repository.interface';

@Injectable()
export class PrismaSourceRepository implements ISourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    type: SourceType;
    name: string;
    description?: string;
    organization?: string;
    url?: string;
    isOfficial: boolean;
  }): Promise<Source> {
    return this.prisma.source.create({ data });
  }

  async findMany(params: SourceFindManyParams): Promise<PaginatedResult<Source>> {
    const where = { deletedAt: null, ...params.where };

    const [items, total] = await Promise.all([
      this.prisma.source.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy,
      }),
      this.prisma.source.count({ where }),
    ]);

    return { items, total };
  }

  async findUnique(where: { id: string }): Promise<Source | null> {
    return this.prisma.source.findUnique({ where });
  }

  async update(
    id: string,
    data: {
      type?: SourceType;
      name?: string;
      description?: string;
      organization?: string;
      url?: string;
      isOfficial?: boolean;
    },
  ): Promise<Source> {
    return this.prisma.source.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.source.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

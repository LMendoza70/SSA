import { Source, SourceType } from '../generated/prisma/client';

export interface SourceFindManyParams {
  where?: {
    type?: SourceType;
    OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; organization?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>;
  };
  skip?: number;
  take?: number;
  orderBy?: { createdAt: 'desc' };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface ISourceRepository {
  create(data: {
    type: SourceType;
    name: string;
    description?: string;
    organization?: string;
    url?: string;
    isOfficial: boolean;
  }): Promise<Source>;

  findMany(params: SourceFindManyParams): Promise<PaginatedResult<Source>>;

  findUnique(where: { id: string }): Promise<Source | null>;

  update(
    id: string,
    data: {
      type?: SourceType;
      name?: string;
      description?: string;
      organization?: string;
      url?: string;
      isOfficial?: boolean;
    },
  ): Promise<Source>;

  softDelete(id: string): Promise<void>;
}

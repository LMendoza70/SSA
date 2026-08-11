import { Validation, ValidationType, ValidationResult } from '../generated/prisma/client';

export interface ValidationFindManyParams {
  where?: {
    type?: ValidationType;
    result?: ValidationResult;
    OR?: Array<{ summary?: { contains: string; mode: 'insensitive' } }>;
  };
  skip?: number;
  take?: number;
  orderBy?: { createdAt: 'desc' };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface ValidationWithRelations extends Validation {
  source?: { id: string; name: string; type: string } | null;
  validatedBy?: { id: string; displayName: string } | null;
}

export interface IValidationRepository {
  create(data: {
    type: ValidationType;
    result: ValidationResult;
    sourceId?: string;
    summary?: string;
    validatedById: string;
    validatedAt: Date;
  }): Promise<ValidationWithRelations>;

  findMany(params: ValidationFindManyParams): Promise<PaginatedResult<ValidationWithRelations>>;

  findUnique(where: { id: string }): Promise<ValidationWithRelations | null>;

  update(
    id: string,
    data: {
      type?: ValidationType;
      result?: ValidationResult;
      sourceId?: string;
      summary?: string;
    },
  ): Promise<ValidationWithRelations>;

  existsSource(sourceId: string): Promise<boolean>;
}

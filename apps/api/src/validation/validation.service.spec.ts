import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { PrismaService } from '../prisma/prisma.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { NotFoundException } from '@nestjs/common';
import { ValidationType, ValidationResult } from '../generated/prisma/client';

describe('ValidationService', () => {
  let service: ValidationService;
  let prisma: any;
  let traceability: any;

  const mockPrisma = {
    source: {
      findUnique: vi.fn(),
    },
    validation: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  };

  const mockTraceability = {
    record: vi.fn(),
  };

  const mockValidation = {
    id: 'val-1',
    type: ValidationType.AUTHENTICITY,
    result: ValidationResult.APPROVED,
    summary: 'Documento verificado',
    validatedAt: new Date('2026-01-01'),
    sourceId: null,
    validatedById: 'user-1',
    source: null,
    validatedBy: { id: 'user-1', displayName: 'Admin' },
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TraceabilityService, useValue: mockTraceability },
      ],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
    prisma = module.get(PrismaService);
    traceability = module.get(TraceabilityService);
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a validation and record traceability', async () => {
      mockPrisma.validation.create.mockResolvedValue(mockValidation);
      const dto = {
        type: ValidationType.AUTHENTICITY,
        result: ValidationResult.APPROVED,
        summary: 'Documento verificado',
      };
      const result = await service.create(dto, 'user-1');
      expect(result.type).toBe('AUTHENTICITY');
      expect(result.result).toBe('APPROVED');
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'VALIDATED',
        userId: 'user-1',
        validationId: 'val-1',
        sourceId: undefined,
        summary: expect.any(String),
      });
    });

    it('should throw if associated source does not exist', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(null);
      const dto = {
        type: ValidationType.AUTHENTICITY,
        result: ValidationResult.APPROVED,
        sourceId: 'invalid-source',
      };
      await expect(service.create(dto, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated validations', async () => {
      mockPrisma.validation.findMany.mockResolvedValue([mockValidation]);
      mockPrisma.validation.count.mockResolvedValue(1);
      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type', async () => {
      mockPrisma.validation.findMany.mockResolvedValue([mockValidation]);
      mockPrisma.validation.count.mockResolvedValue(1);
      await service.findAll({ type: ValidationType.AUTHENTICITY, page: 1, limit: 20 });
      expect(prisma.validation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: ValidationType.AUTHENTICITY }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a validation by id', async () => {
      mockPrisma.validation.findUnique.mockResolvedValue(mockValidation);
      const result = await service.findById('val-1');
      expect(result.id).toBe('val-1');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.validation.findUnique.mockResolvedValue(null);
      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and record traceability', async () => {
      mockPrisma.validation.findUnique.mockResolvedValue(mockValidation);
      mockPrisma.validation.update.mockResolvedValue({ ...mockValidation, summary: 'Updated' });
      const result = await service.update('val-1', { summary: 'Updated' }, 'user-1');
      expect(result.summary).toBe('Updated');
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'UPDATED',
        userId: 'user-1',
        validationId: 'val-1',
        summary: expect.any(String),
      });
    });
  });
});

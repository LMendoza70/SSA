import { Test, TestingModule } from '@nestjs/testing';
import { SourceService } from './source.service';
import { PrismaService } from '../prisma/prisma.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { NotFoundException } from '@nestjs/common';
import { SourceType } from '../generated/prisma/client';

describe('SourceService', () => {
  let service: SourceService;
  let prisma: any;
  let traceability: any;

  const mockPrisma = {
    source: {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TraceabilityService, useValue: mockTraceability },
      ],
    }).compile();

    service = module.get<SourceService>(SourceService);
    prisma = module.get(PrismaService);
    traceability = module.get(TraceabilityService);
    vi.clearAllMocks();
  });

  const mockSource = {
    id: 'src-1',
    type: SourceType.OFFICIAL_EXTERNAL,
    name: 'Organizacion Mundial de la Salud',
    description: 'Documento tecnico',
    organization: 'OMS',
    url: 'https://www.who.int',
    isOfficial: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  describe('create', () => {
    it('should create a source and record traceability', async () => {
      mockPrisma.source.create.mockResolvedValue(mockSource);
      const dto = {
        type: SourceType.OFFICIAL_EXTERNAL,
        name: 'Organizacion Mundial de la Salud',
        organization: 'OMS',
        url: 'https://www.who.int',
        isOfficial: true,
      };
      const result = await service.create(dto, 'user-1');
      expect(result.name).toBe('Organizacion Mundial de la Salud');
      expect(prisma.source.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Organizacion Mundial de la Salud' }),
      });
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'CREATED',
        userId: 'user-1',
        sourceId: 'src-1',
        summary: expect.any(String),
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated sources', async () => {
      mockPrisma.source.findMany.mockResolvedValue([mockSource]);
      mockPrisma.source.count.mockResolvedValue(1);
      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type', async () => {
      mockPrisma.source.findMany.mockResolvedValue([mockSource]);
      mockPrisma.source.count.mockResolvedValue(1);
      await service.findAll({ type: SourceType.OFFICIAL_EXTERNAL, page: 1, limit: 20 });
      expect(prisma.source.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: SourceType.OFFICIAL_EXTERNAL }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a source by id', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);
      const result = await service.findById('src-1');
      expect(result.id).toBe('src-1');
    });

    it('should throw NotFoundException when source not found', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(null);
      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and record traceability', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);
      mockPrisma.source.update.mockResolvedValue({ ...mockSource, name: 'Updated Name' });
      const result = await service.update('src-1', { name: 'Updated Name' }, 'user-1');
      expect(result.name).toBe('Updated Name');
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'UPDATED',
        userId: 'user-1',
        sourceId: 'src-1',
        summary: expect.any(String),
      });
    });

    it('should throw on non-existent source', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(null);
      await expect(service.update('invalid', {}, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete and record traceability', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);
      mockPrisma.source.update.mockResolvedValue({ ...mockSource, deletedAt: new Date() });
      await service.remove('src-1', 'user-1');
      expect(prisma.source.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'src-1' },
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        }),
      );
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'ARCHIVED',
        userId: 'user-1',
        sourceId: 'src-1',
        summary: expect.any(String),
      });
    });
  });
});

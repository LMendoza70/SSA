import { Test, TestingModule } from '@nestjs/testing';
import { SourceService } from './source.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { NotFoundException } from '@nestjs/common';
import { SourceType } from '../generated/prisma/client';
import { ISourceRepository } from './source.repository.interface';

describe('SourceService', () => {
  let service: SourceService;
  let repository: ISourceRepository;
  let traceability: any;

  const mockRepository = {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockTraceability = {
    record: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceService,
        { provide: 'ISourceRepository', useValue: mockRepository },
        { provide: TraceabilityService, useValue: mockTraceability },
      ],
    }).compile();

    service = module.get<SourceService>(SourceService);
    repository = module.get('ISourceRepository');
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
      mockRepository.create.mockResolvedValue(mockSource);
      const dto = {
        type: SourceType.OFFICIAL_EXTERNAL,
        name: 'Organizacion Mundial de la Salud',
        organization: 'OMS',
        url: 'https://www.who.int',
        isOfficial: true,
      };
      const result = await service.create(dto, 'user-1');
      expect(result.name).toBe('Organizacion Mundial de la Salud');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Organizacion Mundial de la Salud' }),
      );
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
      mockRepository.findMany.mockResolvedValue({ items: [mockSource], total: 1 });
      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type', async () => {
      mockRepository.findMany.mockResolvedValue({ items: [mockSource], total: 1 });
      await service.findAll({ type: SourceType.OFFICIAL_EXTERNAL, page: 1, limit: 20 });
      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: SourceType.OFFICIAL_EXTERNAL }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a source by id', async () => {
      mockRepository.findUnique.mockResolvedValue(mockSource);
      const result = await service.findById('src-1');
      expect(result.id).toBe('src-1');
    });

    it('should throw NotFoundException when source not found', async () => {
      mockRepository.findUnique.mockResolvedValue(null);
      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and record traceability', async () => {
      mockRepository.findUnique.mockResolvedValue(mockSource);
      mockRepository.update.mockResolvedValue({ ...mockSource, name: 'Updated Name' });
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
      mockRepository.findUnique.mockResolvedValue(null);
      await expect(service.update('invalid', {}, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete and record traceability', async () => {
      mockRepository.findUnique.mockResolvedValue(mockSource);
      await service.remove('src-1', 'user-1');
      expect(repository.softDelete).toHaveBeenCalledWith('src-1');
      expect(traceability.record).toHaveBeenCalledWith({
        action: 'ARCHIVED',
        userId: 'user-1',
        sourceId: 'src-1',
        summary: expect.any(String),
      });
    });
  });
});

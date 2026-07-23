import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { CreatePublicationDto, PublicationListQueryDto } from './dto';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('PublicationService', () => {
  let service: PublicationService;
  let mockPrisma: any;
  let mockTraceability: any;

  const userId = 'user-1';
  const contentId = 'content-1';
  const publicationId = 'pub-1';

  const mockApprovedReview = { decision: 'APPROVED', isCurrent: true };

  const mockContent = {
    id: contentId,
    title: 'Test Content',
    slug: 'test-content',
    status: 'READY_FOR_PUBLICATION',
    deletedAt: null,
    publication: null,
    publicationReview: mockApprovedReview,
  };

  const mockContentWithoutReview = { ...mockContent, publicationReview: null };
  const mockContentWithStaleReview = { ...mockContent, publicationReview: { decision: 'APPROVED', isCurrent: false } };

  const mockPublication = {
    id: publicationId,
    contentId,
    publicSlug: 'test-content',
    publicTitle: 'Test Content',
    status: 'PUBLISHED',
    institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
    isVisible: true,
    publishedAt: new Date('2026-01-01'),
    withdrawnAt: null,
    archivedAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
    content: {
      id: contentId,
      title: 'Test Content',
      slug: 'test-content',
      status: 'READY_FOR_PUBLICATION',
    },
  };

  const createDto: CreatePublicationDto = {
    institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
  };

  beforeEach(() => {
    mockPrisma = {
      content: { findUnique: vi.fn() },
      publication: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
    };

    mockTraceability = { record: vi.fn() };

    service = new PublicationService(mockPrisma as any, mockTraceability as any);
  });

  describe('create', () => {
    it('should throw NotFoundException when content does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);
      await expect(service.create('nonexistent', createDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when content is soft-deleted', async () => {
      mockPrisma.content.findUnique.mockResolvedValue({
        ...mockContent,
        deletedAt: new Date(),
      });
      await expect(service.create(contentId, createDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when content already has a publication', async () => {
      mockPrisma.content.findUnique.mockResolvedValue({
        ...mockContent,
        publication: mockPublication,
      });
      await expect(service.create(contentId, createDto, userId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when content is not READY_FOR_PUBLICATION', async () => {
      mockPrisma.content.findUnique.mockResolvedValue({
        ...mockContent,
        status: 'DRAFT',
        publication: null,
      });
      await expect(service.create(contentId, createDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when content has no publication review', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContentWithoutReview);
      await expect(service.create(contentId, createDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when publication review is not current', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContentWithStaleReview);
      await expect(service.create(contentId, createDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when institutionalResponsibility is missing', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      const incompleteDto: CreatePublicationDto = {} as any;
      await expect(service.create(contentId, incompleteDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create publication successfully when all eligibility checks pass', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.publication.findUnique.mockResolvedValue(null);
      mockPrisma.publication.create.mockResolvedValue(mockPublication);

      const result = await service.create(contentId, createDto, userId);

      expect(result).toHaveProperty('id', publicationId);
      expect(result).toHaveProperty('status', 'PUBLISHED');
      expect(result).toHaveProperty('institutionalResponsibility');
      expect(mockPrisma.publication.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
          }),
        }),
      );
      expect(mockTraceability.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'PUBLISHED' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const query: PublicationListQueryDto = { page: 1, limit: 20 };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when publication does not exist', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when publication is soft-deleted', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        ...mockPublication,
        deletedAt: new Date(),
      });

      await expect(service.findById(publicationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return publication when found', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(mockPublication);

      const result = await service.findById(publicationId);

      expect(result).toHaveProperty('id', publicationId);
    });
  });

  describe('withdraw', () => {
    it('should throw NotFoundException when publication does not exist', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(null);

      await expect(service.withdraw('nonexistent', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when publication is not PUBLISHED', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        ...mockPublication,
        status: 'ARCHIVED',
      });

      await expect(service.withdraw(publicationId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should withdraw publication successfully', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(mockPublication);
      mockPrisma.publication.update.mockResolvedValue({
        ...mockPublication,
        status: 'WITHDRAWN',
        withdrawnAt: new Date(),
        isVisible: false,
      });

      const result = await service.withdraw(publicationId, userId);

      expect(result).toHaveProperty('status', 'WITHDRAWN');
      expect(result).toHaveProperty('isVisible', false);
      expect(mockTraceability.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'WITHDRAWN' }),
      );
    });
  });

  describe('archive', () => {
    it('should throw NotFoundException when publication does not exist', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(null);

      await expect(service.archive('nonexistent', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when publication is already ARCHIVED', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        ...mockPublication,
        status: 'ARCHIVED',
      });

      await expect(service.archive(publicationId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should archive publication successfully', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(mockPublication);
      mockPrisma.publication.update.mockResolvedValue({
        ...mockPublication,
        status: 'ARCHIVED',
        archivedAt: new Date(),
        isVisible: false,
      });

      const result = await service.archive(publicationId, userId);

      expect(result).toHaveProperty('status', 'ARCHIVED');
      expect(result).toHaveProperty('isVisible', false);
      expect(mockTraceability.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'ARCHIVED' }),
      );
    });
  });
});

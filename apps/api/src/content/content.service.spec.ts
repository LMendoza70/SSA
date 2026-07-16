import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';
import { TraceabilityService } from '../traceability/traceability.service';
import { CreateContentDto, ContentListQueryDto } from './dto';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('ContentService', () => {
  let service: ContentService;
  let mockPrisma: any;
  let mockTraceability: any;

  const userId = 'user-1';
  const contentTypeId = 'ct-1';
  const contentId = 'content-1';

  const mockContentType = { id: contentTypeId, code: 'news', name: 'Noticia' };

  const mockContent = {
    id: contentId,
    contentTypeId,
    contentType: mockContentType,
    title: 'Test Content',
    slug: 'test-content',
    summary: 'A summary',
    body: '<p>Body</p>',
    status: 'DRAFT',
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Desc',
    createdById: userId,
    updatedById: userId,
    createdBy: { id: userId, displayName: 'Administrador' },
    updatedBy: { id: userId, displayName: 'Administrador' },
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  beforeEach(() => {
    mockPrisma = {
      contentType: { findUnique: vi.fn() },
      content: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
    };

    mockTraceability = { record: vi.fn() };

    service = new ContentService(mockPrisma as any, mockTraceability as any);
  });

  describe('create', () => {
    const dto: CreateContentDto = {
      contentTypeId,
      title: 'Test Content',
      summary: 'A summary',
      body: '<p>Body</p>',
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Desc',
    };

    it('should throw NotFoundException when contentType does not exist', async () => {
      mockPrisma.contentType.findUnique.mockResolvedValue(null);

      await expect(service.create(dto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create content successfully', async () => {
      mockPrisma.contentType.findUnique.mockResolvedValue(mockContentType);
      mockPrisma.content.findUnique.mockResolvedValue(null);
      mockPrisma.content.create.mockResolvedValue(mockContent);

      const result = await service.create(dto, userId);

      expect(result).toHaveProperty('id', contentId);
      expect(result).toHaveProperty('title', 'Test Content');
      expect(mockTraceability.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATED' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockPrisma.content.findMany.mockResolvedValue([mockContent]);
      mockPrisma.content.count.mockResolvedValue(1);

      const query: ContentListQueryDto = { page: 1, limit: 20 };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should apply search filter', async () => {
      mockPrisma.content.findMany.mockResolvedValue([]);
      mockPrisma.content.count.mockResolvedValue(0);

      await service.findAll({ search: 'test' });

      const findManyCall = mockPrisma.content.findMany.mock.calls[0][0];
      expect(findManyCall.where.OR).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when content does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when content is soft-deleted', async () => {
      mockPrisma.content.findUnique.mockResolvedValue({
        ...mockContent,
        deletedAt: new Date(),
      });

      await expect(service.findById(contentId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return content when found', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);

      const result = await service.findById(contentId);

      expect(result).toHaveProperty('id', contentId);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when content does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { title: 'New' }, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update content successfully', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.content.update.mockResolvedValue({
        ...mockContent,
        title: 'Updated Title',
      });

      const result = await service.update(
        contentId,
        { title: 'Updated Title' },
        userId,
      );

      expect(result).toHaveProperty('title', 'Updated Title');
      expect(mockTraceability.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATED' }),
      );
    });

    it('should trace status change on update', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.content.update.mockResolvedValue({
        ...mockContent,
        status: 'PREPARED',
      });

      await service.update(contentId, { status: 'PREPARED' as any }, userId);

      const traceCalls = mockTraceability.record.mock.calls;
      const statusChangeCall = traceCalls.find(
        (c: any) => c[0].action === 'PREPARED',
      );
      expect(statusChangeCall).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when content does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft-delete content', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.content.update.mockResolvedValue({
        ...mockContent,
        deletedAt: new Date(),
      });

      await service.remove(contentId);

      const updateData = mockPrisma.content.update.mock.calls[0][0].data;
      expect(updateData).toHaveProperty('deletedAt');
      expect(updateData.deletedAt).toBeInstanceOf(Date);
    });
  });
});

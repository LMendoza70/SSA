import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MediaService } from './media.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('MediaService', () => {
  let service: MediaService;
  let mockPrisma: any;
  let mockStorage: any;

  const mockResource = {
    id: 'media-1',
    type: 'IMAGE',
    title: 'Test Image',
    description: 'An image',
    resourceUri: 'images/test.jpg',
    externalUrl: null,
    mimeType: 'image/jpeg',
    altText: 'Test alt',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  beforeEach(() => {
    mockPrisma = {
      mediaResource: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      content: { findUnique: vi.fn() },
      contentMediaResource: {
        findMany: vi.fn(),
        deleteMany: vi.fn(),
        createMany: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    mockStorage = {
      save: vi.fn().mockResolvedValue('images/test.jpg'),
      getUrl: vi.fn().mockReturnValue('/uploads/images/test.jpg'),
      delete: vi.fn(),
    };

    service = new MediaService(mockPrisma as any, mockStorage as any);
  });

  describe('upload', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 500,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    it('should throw BadRequestException when no file provided', async () => {
      await expect(service.upload(null as any, { type: 'IMAGE' as any, title: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file exceeds max size', async () => {
      const bigFile = { ...mockFile, size: 11 * 1024 * 1024 };

      await expect(service.upload(bigFile as any, { type: 'IMAGE' as any, title: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for unsupported MIME type', async () => {
      const unsupportedFile = { ...mockFile, mimetype: 'application/octet-stream' };

      await expect(
        service.upload(unsupportedFile as any, { type: 'IMAGE' as any, title: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for MIME/type mismatch', async () => {
      const pdfFile = { ...mockFile, mimetype: 'application/pdf' };

      await expect(
        service.upload(pdfFile as any, { type: 'IMAGE' as any, title: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upload file successfully', async () => {
      mockPrisma.mediaResource.create.mockResolvedValue(mockResource);

      const result = await service.upload(mockFile, { type: 'IMAGE' as any, title: 'Test Image', altText: 'Test alt' });

      expect(mockStorage.save).toHaveBeenCalledWith(mockFile, 'image');
      expect(mockStorage.getUrl).toHaveBeenCalledWith('images/test.jpg');
      expect(result).toHaveProperty('id', 'media-1');
      expect(result).toHaveProperty('url', '/uploads/images/test.jpg');
    });
  });

  describe('createExternal', () => {
    it('should create external resource without URI', async () => {
      mockPrisma.mediaResource.create.mockResolvedValue({
        ...mockResource,
        resourceUri: null,
        externalUrl: 'https://example.com/video',
      });

      const result = await service.createExternal({
        type: 'VIDEO_LINK' as any,
        title: 'External Video',
      });

      expect(result).toHaveProperty('id', 'media-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockPrisma.mediaResource.findMany.mockResolvedValue([mockResource]);
      mockPrisma.mediaResource.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type', async () => {
      mockPrisma.mediaResource.findMany.mockResolvedValue([]);
      mockPrisma.mediaResource.count.mockResolvedValue(0);

      await service.findAll({ type: 'IMAGE' as any, page: 1, limit: 20 });

      const where = mockPrisma.mediaResource.findMany.mock.calls[0][0].where;
      expect(where.type).toBe('IMAGE');
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when resource does not exist', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return resource when found', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findById('media-1');

      expect(result).toHaveProperty('id', 'media-1');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when resource does not exist', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', { title: 'New' })).rejects.toThrow(NotFoundException);
    });

    it('should update resource metadata', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(mockResource);
      mockPrisma.mediaResource.update.mockResolvedValue({ ...mockResource, title: 'Updated' });

      const result = await service.update('media-1', { title: 'Updated' });

      expect(result).toHaveProperty('title', 'Updated');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when resource does not exist', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete and delete storage file', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(mockResource);
      mockPrisma.mediaResource.update.mockResolvedValue({ ...mockResource, deletedAt: new Date(), isActive: false });

      await service.remove('media-1');

      expect(mockStorage.delete).toHaveBeenCalledWith('images/test.jpg');
      expect(mockPrisma.mediaResource.update.mock.calls[0][0].data.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('associateContent', () => {
    it('should throw NotFoundException when content does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);

      await expect(service.associateContent('nonexistent', { mediaResourceIds: ['media-1'] })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should associate media to content', async () => {
      mockPrisma.content.findUnique.mockResolvedValue({ id: 'content-1', deletedAt: null });
      mockPrisma.mediaResource.findUnique.mockResolvedValue(mockResource);

      await service.associateContent('content-1', { mediaResourceIds: ['media-1'] });

      expect(mockPrisma.contentMediaResource.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.contentMediaResource.createMany).toHaveBeenCalled();
    });
  });
});

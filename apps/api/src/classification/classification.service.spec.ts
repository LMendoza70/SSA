import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ClassificationService } from './classification.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('ClassificationService', () => {
  let service: ClassificationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      category: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      tag: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      contentType: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      contentCategory: {
        deleteMany: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
      },
      contentTag: {
        deleteMany: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
      },
      content: {
        findUnique: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    service = new ClassificationService(mockPrisma as any);
  });

  describe('Category CRUD', () => {
    const mockCategory = { id: 'cat-1', name: 'Salud', slug: 'salud', description: null, deletedAt: null };

    it('should create category with generated slug', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory({ name: 'Salud' });

      expect(mockPrisma.category.create.mock.calls[0][0].data.slug).toBe('salud');
      expect(result).toHaveProperty('id', 'cat-1');
    });

    it('should throw ConflictException when category slug already exists', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);

      await expect(service.createCategory({ name: 'Salud' })).rejects.toThrow(ConflictException);
    });

    it('should return all non-deleted categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAllCategories();

      expect(result).toHaveLength(1);
    });

    it('should throw NotFoundException when category not found by id', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findCategoryById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete category', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.update.mockResolvedValue({ ...mockCategory, deletedAt: new Date() });

      await service.removeCategory('cat-1');

      expect(mockPrisma.category.update.mock.calls[0][0].data).toHaveProperty('deletedAt');
    });

    it('should throw ConflictException on rename when slug conflicts', async () => {
      mockPrisma.category.findUnique
        .mockResolvedValueOnce(mockCategory) // findCategoryById
        .mockResolvedValueOnce({ id: 'cat-2', slug: 'nuevo-slug' }); // slug conflict

      await expect(
        service.updateCategory('cat-1', { name: 'Nuevo Slug' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Tag CRUD', () => {
    const mockTag = { id: 'tag-1', name: 'Vacunación', slug: 'vacunacion', description: null, deletedAt: null };

    it('should create tag with generated slug', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue(mockTag);

      const result = await service.createTag({ name: 'Vacunación' });

      expect(result).toHaveProperty('id', 'tag-1');
    });

    it('should throw ConflictException when tag slug already exists', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(mockTag);

      await expect(service.createTag({ name: 'Vacunación' })).rejects.toThrow(ConflictException);
    });

    it('should soft-delete tag', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(mockTag);

      await service.removeTag('tag-1');

      expect(mockPrisma.tag.update.mock.calls[0][0].data).toHaveProperty('deletedAt');
    });
  });

  describe('ContentType CRUD', () => {
    const mockCT = { id: 'ct-1', code: 'news', name: 'Noticia', description: null, isActive: true, deletedAt: null };

    it('should create contentType', async () => {
      mockPrisma.contentType.findUnique.mockResolvedValue(null);
      mockPrisma.contentType.create.mockResolvedValue(mockCT);

      const result = await service.createContentType({ code: 'news', name: 'Noticia' });

      expect(result).toHaveProperty('code', 'news');
    });

    it('should throw ConflictException when code already exists', async () => {
      mockPrisma.contentType.findUnique.mockResolvedValue(mockCT);

      await expect(service.createContentType({ code: 'news', name: 'Noticia' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should soft-delete contentType', async () => {
      mockPrisma.contentType.findUnique.mockResolvedValue(mockCT);

      await service.removeContentType('ct-1');

      expect(mockPrisma.contentType.update.mock.calls[0][0].data).toHaveProperty('deletedAt');
    });
  });

  describe('Associations', () => {
    const mockContent = { id: 'content-1', title: 'Test', deletedAt: null };

    it('should associate categories to content', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-1' });

      await service.associateCategories('content-1', ['cat-1']);

      expect(mockPrisma.contentCategory.deleteMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException when content does not exist for category association', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(null);

      await expect(service.associateCategories('nonexistent', ['cat-1'])).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.associateCategories('content-1', ['nonexistent'])).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should associate tags to content', async () => {
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);
      mockPrisma.tag.findUnique.mockResolvedValue({ id: 'tag-1' });

      await service.associateTags('content-1', ['tag-1']);

      expect(mockPrisma.contentTag.deleteMany).toHaveBeenCalled();
    });
  });
});

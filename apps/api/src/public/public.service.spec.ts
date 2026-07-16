import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { PublicService } from './public.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('PublicService - No exposición pública accidental', () => {
  let service: PublicService;
  let mockPrisma: any;

  const mockPublishedPublication = {
    id: 'pub-1',
    contentId: 'content-1',
    publicSlug: 'publicacion-activa',
    publicTitle: 'Publicación Activa',
    status: 'PUBLISHED',
    isVisible: true,
    publishedAt: new Date('2026-01-01'),
    withdrawnAt: null,
    archivedAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
    content: {
      id: 'content-1',
      title: 'Contenido Activo',
      summary: 'Resumen',
      body: '<p>Body</p>',
      seoTitle: 'SEO',
      seoDescription: 'SEO Desc',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      contentType: { id: 'ct-1', code: 'news', name: 'Noticia' },
    },
  };

  const mockWithdrawnPublication = {
    ...mockPublishedPublication,
    id: 'pub-2',
    publicSlug: 'publicacion-retirada',
    publicTitle: 'Publicación Retirada',
    status: 'WITHDRAWN',
    isVisible: false,
    withdrawnAt: new Date('2026-02-01'),
  };

  const mockArchivedPublication = {
    ...mockPublishedPublication,
    id: 'pub-3',
    publicSlug: 'publicacion-archivada',
    publicTitle: 'Publicación Archivada',
    status: 'ARCHIVED',
    isVisible: false,
    archivedAt: new Date('2026-03-01'),
  };

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findMany: vi.fn(),
        count: vi.fn(),
        findFirst: vi.fn(),
      },
    };

    service = new PublicService(mockPrisma as any);
  });

  describe('findAllPublications - filtra solo PUBLICADAS', () => {
    it('should only return publications with status=PUBLISHED and isVisible=true', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const where = mockPrisma.publication.findMany.mock.calls[0][0].where;
      expect(where.status).toBe('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
      expect(result.data).toHaveLength(1);
    });

    it('should exclude withdrawn publications from results', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const withdrawnSlugs = result.data.map((p: any) => p.publicSlug);
      expect(withdrawnSlugs).not.toContain('publicacion-retirada');
    });

    it('should exclude archived publications from results', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const archivedSlugs = result.data.map((p: any) => p.publicSlug);
      expect(archivedSlugs).not.toContain('publicacion-archivada');
    });
  });

  describe('findBySlug - solo publicación activa por slug', () => {
    it('should return publication when slug matches active publication', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(mockPublishedPublication);

      const result = await service.findBySlug('publicacion-activa');

      expect(result).toHaveProperty('publicSlug', 'publicacion-activa');
    });

    it('should throw NotFoundException for withdrawn publication slug', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(null);

      await expect(
        service.findBySlug('publicacion-retirada'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for archived publication slug', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(null);

      await expect(
        service.findBySlug('publicacion-archivada'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should filter by status=PUBLISHED and isVisible=true', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(mockPublishedPublication);

      await service.findBySlug('publicacion-activa');

      const where = mockPrisma.publication.findFirst.mock.calls[0][0].where;
      expect(where.status).toBe('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
    });
  });

  describe('findFeatured - solo destacadas activas', () => {
    it('should only return active featured publications', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);

      const result = await service.findFeatured();

      const where = mockPrisma.publication.findMany.mock.calls[0][0].where;
      expect(where.status).toBe('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
      expect(result).toHaveLength(1);
    });
  });

  describe('search - solo publicaciones activas', () => {
    it('should filter search results to active publications only', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.search({ q: 'salud', page: 1, limit: 20 });

      const where = mockPrisma.publication.findMany.mock.calls[0][0].where;
      expect(where.status).toBe('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
      expect(result.data).toHaveLength(1);
    });

    it('should return empty results when searching for withdrawn content', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([]);
      mockPrisma.publication.count.mockResolvedValue(0);

      const result = await service.search({ q: 'retirada', page: 1, limit: 20 });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });
});

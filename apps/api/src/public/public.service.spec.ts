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
    institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
    isVisible: true,
    publishedAt: new Date('2026-01-01'),
    updatedAtPublic: null,
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
      deletedAt: null,
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

  const mockUpdatedPublication = {
    ...mockPublishedPublication,
    id: 'pub-4',
    publicSlug: 'publicacion-actualizada',
    publicTitle: 'Publicación Actualizada',
    status: 'UPDATED',
    updatedAtPublic: new Date('2026-04-01'),
  };

  const mockStorage = {
    save: vi.fn(),
    delete: vi.fn(),
    getUrl: vi.fn((uri: string) => `/uploads/${uri}`),
  };

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findMany: vi.fn(),
        count: vi.fn(),
        findFirst: vi.fn(),
      },
      source: { findMany: vi.fn() },
      mediaResource: { findUnique: vi.fn() },
    };

    service = new PublicService(mockPrisma as any, mockStorage);
  });

  describe('findAllPublications - filtra solo publicaciones visibles', () => {
    it('should only return publications with visible statuses and isVisible=true', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const where = mockPrisma.publication.findMany.mock.calls[0][0].where;
      expect(where.status.in).toContain('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
      expect(where.content.deletedAt).toBeNull();
      expect(result.data).toHaveLength(1);
    });

    it('should exclude withdrawn publications from results', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const slugs = result.data.map((p: any) => p.publicSlug);
      expect(slugs).not.toContain('publicacion-retirada');
    });

    it('should exclude archived publications from results', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const slugs = result.data.map((p: any) => p.publicSlug);
      expect(slugs).not.toContain('publicacion-archivada');
    });

    it('should include UPDATED publications as visible', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication, mockUpdatedPublication]);
      mockPrisma.publication.count.mockResolvedValue(2);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      const slugs = result.data.map((p: any) => p.publicSlug);
      expect(slugs).toContain('publicacion-actualizada');
    });

    it('should expose institutionalResponsibility in public response', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);
      mockPrisma.publication.count.mockResolvedValue(1);

      const result = await service.findAllPublications({ page: 1, limit: 20 });

      expect(result.data[0]).toHaveProperty(
        'institutionalResponsibility',
        'Jurisdicción Sanitaria de Huejutla de Reyes',
      );
    });
  });

  describe('findBySlug - solo publicación activa por slug', () => {
    it('should return publication when slug matches active publication', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(mockPublishedPublication);

      const result = await service.findBySlug('publicacion-activa');

      expect(result).toHaveProperty('publicSlug', 'publicacion-activa');
      expect(result).toHaveProperty('institutionalResponsibility');
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

    it('should filter by visible status and isVisible=true', async () => {
      mockPrisma.publication.findFirst.mockResolvedValue(mockPublishedPublication);

      await service.findBySlug('publicacion-activa');

      const where = mockPrisma.publication.findFirst.mock.calls[0][0].where;
      expect(where.status.in).toContain('PUBLISHED');
      expect(where.isVisible).toBe(true);
      expect(where.deletedAt).toBeNull();
    });
  });

  describe('findFeatured - solo destacadas activas', () => {
    it('should only return active featured publications', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([mockPublishedPublication]);

      const result = await service.findFeatured();

      const where = mockPrisma.publication.findMany.mock.calls[0][0].where;
      expect(where.status.in).toContain('PUBLISHED');
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
      expect(where.status.in).toContain('PUBLISHED');
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

  describe('findAllSources - fuentes públicas activas', () => {
    it('should return only non-deleted sources', async () => {
      const mockSources = [
        { id: 'src-1', type: 'OFFICIAL_EXTERNAL', name: 'OMS', description: null, organization: 'OMS', url: null, isOfficial: true },
      ];
      mockPrisma.source.findMany.mockResolvedValue(mockSources);

      const result = await service.findAllSources();

      expect(result).toHaveLength(1);
      expect(mockPrisma.source.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
        }),
      );
    });
  });

  describe('findMediaResource - recurso multimedia público', () => {
    it('should throw NotFoundException when resource does not exist', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue(null);
      await expect(service.findMediaResource('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when resource is not active', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue({
        id: 'm-1',
        isActive: false,
        deletedAt: null,
      });
      await expect(service.findMediaResource('m-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when resource is soft-deleted', async () => {
      mockPrisma.mediaResource.findUnique.mockResolvedValue({
        id: 'm-1',
        isActive: true,
        deletedAt: new Date(),
      });
      await expect(service.findMediaResource('m-1')).rejects.toThrow(NotFoundException);
    });

    it('should return resource metadata when active and not deleted', async () => {
      const mockResource = {
        id: 'm-1',
        type: 'IMAGE',
        title: 'Infografía Dengue',
        description: 'Infografía preventiva',
        resourceUri: 'uploads/dengue.png',
        externalUrl: null,
        mimeType: 'image/png',
        altText: 'Infografía sobre prevención del dengue',
        isActive: true,
        deletedAt: null,
      };
      mockPrisma.mediaResource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findMediaResource('m-1');

      expect(result.id).toBe('m-1');
      expect(result.title).toBe('Infografía Dengue');
      expect(result.url).toBe('/uploads/uploads/dengue.png');
      expect(result).not.toHaveProperty('isActive');
      expect(result).not.toHaveProperty('deletedAt');
    });
  });
});

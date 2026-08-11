import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentService } from './content.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

function makeMockContent(id: string, title: string, idx: number) {
  return {
    id,
    contentTypeId: 'ct-1',
    contentType: { id: 'ct-1', code: 'news', name: 'Noticia' },
    title,
    slug: `content-${idx}`,
    summary: `Summary ${idx}`,
    body: `<p>Body ${idx}</p>`,
    status: 'DRAFT',
    seoTitle: null,
    seoDescription: null,
    createdById: 'user-1',
    updatedById: 'user-1',
    createdBy: { id: 'user-1', displayName: 'Administrador' },
    updatedBy: { id: 'user-1', displayName: 'Administrador' },
    createdAt: new Date(`2026-01-${String(idx + 1).padStart(2, '0')}`),
    updatedAt: new Date(`2026-01-${String(idx + 1).padStart(2, '0')}`),
    deletedAt: null,
  };
}

describe('ContentService - Paginación', () => {
  let service: ContentService;
  let mockPrisma: any;

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

    service = new ContentService(mockPrisma as any, { record: vi.fn() } as any);
  });

  it('should return page 1 with correct meta when total fits in one page', async () => {
    mockPrisma.content.findMany.mockResolvedValue(
      Array.from({ length: 5 }, (_, i) => makeMockContent(`id-${i}`, `Content ${i}`, i)),
    );
    mockPrisma.content.count.mockResolvedValue(5);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(5);
    expect(result.meta).toEqual({ total: 5, page: 1, limit: 20, totalPages: 1 });
  });

  it('should calculate totalPages correctly when total exceeds limit', async () => {
    mockPrisma.content.findMany.mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => makeMockContent(`id-${i}`, `Content ${i}`, i)),
    );
    mockPrisma.content.count.mockResolvedValue(55);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(result.meta.totalPages).toBe(3);
    expect(result.meta.total).toBe(55);
  });

  it('should apply skip based on page number', async () => {
    mockPrisma.content.findMany.mockResolvedValue([]);
    mockPrisma.content.count.mockResolvedValue(50);

    await service.findAll({ page: 3, limit: 10 });

    const queryArgs = mockPrisma.content.findMany.mock.calls[0][0];
    expect(queryArgs.skip).toBe(20);
    expect(queryArgs.take).toBe(10);
  });

  it('should use default page=1 and limit=20 when not specified', async () => {
    mockPrisma.content.findMany.mockResolvedValue([]);
    mockPrisma.content.count.mockResolvedValue(0);

    await service.findAll({});

    const queryArgs = mockPrisma.content.findMany.mock.calls[0][0];
    expect(queryArgs.skip).toBe(0);
    expect(queryArgs.take).toBe(20);
  });

  it('should return empty data array when no content exists', async () => {
    mockPrisma.content.findMany.mockResolvedValue([]);
    mockPrisma.content.count.mockResolvedValue(0);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });
});

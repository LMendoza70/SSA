import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  source: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  validation: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  content: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  publication: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  contentType: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  tag: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  contentSource: {
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  },
  contentValidation: {
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  },
  contentCategory: {
    findMany: vi.fn(),
  },
  contentTag: {
    findMany: vi.fn(),
  },
  contentMediaResource: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  traceabilityRecord: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  campaign: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  disease: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((cb: any) => cb(mockPrisma)),
};

describe('Source + Validation Integration (HTTP layer)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@jurisdiccion.gob.mx',
      displayName: 'Administrador',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$MykeCysah7KClKF0PhNChQ$+dWAsA/Gkc1lpG77GaOp21Xd6X7q96gxH832X1MAewg',
      isActive: true,
      createdAt: new Date('2026-01-01'),
    };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Salud', slug: 'salud', isActive: true, deletedAt: null });
    mockPrisma.tag.findUnique.mockResolvedValue({ id: 'tag-1', name: 'Dengue', slug: 'dengue', isActive: true, deletedAt: null });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });

    accessToken = loginRes.body.accessToken;
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sources', () => {
    const mockSource = {
      id: 'src-1',
      type: 'OFFICIAL_EXTERNAL',
      name: 'Organizacion Mundial de la Salud',
      description: 'Documento tecnico',
      organization: 'OMS',
      url: 'https://www.who.int',
      isOfficial: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      deletedAt: null,
    };

    it('POST /admin/sources - creates a source', async () => {
      mockPrisma.source.create.mockResolvedValue(mockSource);

      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/sources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'OFFICIAL_EXTERNAL',
          name: 'Organizacion Mundial de la Salud',
          organization: 'OMS',
          url: 'https://www.who.int',
          isOfficial: true,
        })
        .expect(201);

      expect(res.body.name).toBe('Organizacion Mundial de la Salud');
    });

    it('GET /admin/sources - lists sources with pagination', async () => {
      mockPrisma.source.findMany.mockResolvedValue([mockSource]);
      mockPrisma.source.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/sources')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });

    it('GET /admin/sources/:id - returns source by id', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);

      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/sources/src-1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.id).toBe('src-1');
    });

    it('GET /admin/sources/:id - 404 for unknown source', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/sources/nonexistent')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('PATCH /admin/sources/:id - updates a source', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);
      vi.mocked(mockPrisma.source.update).mockResolvedValue({ ...mockSource, name: 'Updated' });

      const res = await request(app.getHttpServer())
        .patch('/api/v1/admin/sources/src-1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated' })
        .expect(200);

      expect(res.body.name).toBe('Updated');
    });

    it('DELETE /admin/sources/:id - soft deletes a source', async () => {
      mockPrisma.source.findUnique.mockResolvedValue(mockSource);

      const res = await request(app.getHttpServer())
        .delete('/api/v1/admin/sources/src-1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Validations', () => {
    const mockValidation = {
      id: 'val-1',
      type: 'AUTHENTICITY',
      result: 'APPROVED',
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

    it('POST /admin/validations - creates a validation', async () => {
      mockPrisma.validation.create.mockResolvedValue(mockValidation);
      mockPrisma.traceabilityRecord.create.mockResolvedValue({});

      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/validations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'AUTHENTICITY',
          result: 'APPROVED',
          summary: 'Documento verificado',
        })
        .expect(201);

      expect(res.body.type).toBe('AUTHENTICITY');
      expect(res.body.result).toBe('APPROVED');
    });

    it('GET /admin/validations - lists validations with pagination', async () => {
      mockPrisma.validation.findMany.mockResolvedValue([mockValidation]);
      mockPrisma.validation.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/validations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });
  });

  describe('Publication rules enforcement', () => {
    it('POST /admin/contents/:id/publication - rejects content in DRAFT status', async () => {
      const mockContent = {
        id: 'content-1',
        status: 'DRAFT',
        deletedAt: null,
        publication: null,
        contentSources: [],
        contentValidations: [],
        contentTypeId: 'ct-1',
        title: 'Test',
        slug: 'test',
        summary: null,
        body: null,
        seoTitle: null,
        seoDescription: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        contentType: { id: 'ct-1', code: 'news', name: 'Noticia' },
      };
      mockPrisma.content.findUnique.mockResolvedValue(mockContent);

      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/contents/content-1/publication')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ institutionalResponsibility: 'Jurisdiccion Sanitaria de Huejutla' })
        .expect(400);

      expect(res.body.message).toContain('READY_FOR_PUBLICATION');
    });

    it('POST /admin/contents/:id/publication - requires auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/contents/content-1/publication')
        .send({ institutionalResponsibility: 'Test' })
        .expect(401);
    });
  });

  describe('Public filters (no auth required)', () => {
    it('GET /public/publications - returns published content', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([]);
      mockPrisma.publication.count.mockResolvedValue(0);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications?page=1&limit=10')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
    });

    it('GET /public/categories/:slug/publications - filters by category', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([]);
      mockPrisma.publication.count.mockResolvedValue(0);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/categories/salud/publications')
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });

    it('GET /public/tags/:slug/publications - filters by tag', async () => {
      mockPrisma.publication.findMany.mockResolvedValue([]);
      mockPrisma.publication.count.mockResolvedValue(0);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/tags/dengue/publications')
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });

    it('GET /public/sources - returns public sources', async () => {
      mockPrisma.source.findMany.mockResolvedValue([]);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/sources')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('Auth enforcement on admin endpoints', () => {
    it('GET /admin/sources - requires auth', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/sources')
        .expect(401);
    });

    it('POST /admin/validations - requires auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/validations')
        .send({ type: 'AUTHENTICITY', result: 'APPROVED' })
        .expect(401);
    });
  });
});

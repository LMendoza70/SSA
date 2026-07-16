import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/setup';

describe('Content + Publication Integration (admin endpoints)', () => {
  let app: INestApplication;
  let accessToken: string;
  let contentTypeId: string;
  let contentId: string;
  let publicationId: string;

  beforeAll(async () => {
    app = await createTestApp();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });
    accessToken = loginRes.body.accessToken;

    const ctRes = await request(app.getHttpServer())
      .get('/api/v1/public/content-types')
      .set('Authorization', `Bearer ${accessToken}`);
    contentTypeId = ctRes.body[0]?.id;
  });

  afterAll(async () => {
    await app.close();
  });

  const uniqueId = Date.now();

  describe('POST /api/v1/admin/contents', () => {
    it('should create content and return 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Test Content ${uniqueId}`,
          summary: 'Integration test summary',
          body: '<p>Integration test body</p>',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', `Test Content ${uniqueId}`);
      expect(res.body).toHaveProperty('status', 'DRAFT');
      contentId = res.body.id;
    });

    it('should reject creating content without auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .send({ contentTypeId, title: 'Unauthorized' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/admin/contents', () => {
    it('should return paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('total');
    });
  });

  describe('PATCH /api/v1/admin/contents/:id', () => {
    it('should update content status to PREPARED', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'PREPARED' });

      expect(res.status).toBe(200);
    });

    it('should update content to READY_FOR_PUBLICATION', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'READY_FOR_PUBLICATION');
    });
  });

  describe('POST /api/v1/admin/contents/:id/publication', () => {
    it('should create publication from content', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentId}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('status', 'PUBLISHED');
      expect(res.body).toHaveProperty('isVisible', true);
      publicationId = res.body.id;
    });
  });

  describe('GET /api/v1/public/publications', () => {
    it('should return the published content on public endpoint', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      const slugs = res.body.data.map((p: any) => p.publicSlug);
      expect(slugs).toContain(`test-content-${uniqueId}`);
    });
  });

  describe('POST /api/v1/admin/publications/:id/withdrawal', () => {
    it('should withdraw publication', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/publications/${publicationId}/withdrawal`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'WITHDRAWN');
      expect(res.body).toHaveProperty('isVisible', false);
    });

    it('should hide withdrawn publication from public endpoint', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      const slugs = res.body.data.map((p: any) => p.publicSlug);
      expect(slugs).not.toContain(`test-content-${uniqueId}`);
    });
  });
});

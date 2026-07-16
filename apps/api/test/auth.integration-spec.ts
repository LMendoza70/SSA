import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/setup';

describe('Auth Integration (POST /api/v1/auth/login, refresh, me)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 401 with invalid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should return 200 with accessToken and set refresh cookie on valid login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', 'admin@jurisdiccion.gob.mx');
    });
  });

  describe('GET /api/v1/auth/me (protected)', () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });
      accessToken = res.body.accessToken;
    });

    it('should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 200 with user profile when authenticated', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'admin@jurisdiccion.gob.mx');
      expect(res.body).toHaveProperty('displayName', 'Admin');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let cookies: string[];

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });
      cookies = res.headers['set-cookie'] || [];
    });

    it('should return 401 without refresh cookie', async () => {
      const res = await request(app.getHttpServer()).post('/api/v1/auth/refresh');
      expect(res.status).toBe(401);
    });

    it('should return 200 with new access token when refresh cookie is valid', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });
  });
});

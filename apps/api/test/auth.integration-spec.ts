import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/setup';

describe('Auth Integration', () => {
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
      expect(res.body.user).toHaveProperty('displayName', 'Administrador');
      expect(res.headers['set-cookie']).toBeDefined();
      const cookie = (res.headers['set-cookie'] as string[]).find((c: string) => c.startsWith('refresh_token='));
      expect(cookie).toBeDefined();
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
      expect(res.body).toHaveProperty('displayName', 'Administrador');
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
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('Logout invalidation', () => {
    let cookies: string[];

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });
      cookies = res.headers['set-cookie'] || [];
    });

    it('should return 200 on logout', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject refresh token after logout', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(401);
    });
  });

  describe('Refresh token rotation', () => {
    let firstCookies: string[];
    let secondCookies: string[];

    beforeAll(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@jurisdiccion.gob.mx', password: 'admin123' });
      firstCookies = loginRes.headers['set-cookie'] || [];

      const refreshRes = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', firstCookies);
      secondCookies = refreshRes.headers['set-cookie'] || [];
    });

    it('should reject the old refresh token after rotation', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', firstCookies);

      expect(res.status).toBe(401);
    });

    it('should accept the new refresh token after rotation', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', secondCookies);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });
  });
});

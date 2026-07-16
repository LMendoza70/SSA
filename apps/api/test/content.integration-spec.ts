import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/setup';

describe('Bloque 2 — Publicación institucional y contrato público', () => {
  let app: INestApplication;
  let accessToken: string;
  let contentTypeId: string;
  let contentId: string;
  let sourceId: string;
  let validationId: string;
  let publicationId: string;
  let publicSlug: string;

  const uniqueId = Date.now();
  const testTitle = `Test Bloque 2 ${uniqueId}`;

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

  describe('Paso 1 — Crear contenido editorial', () => {
    it('debe crear contenido con status DRAFT', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: testTitle,
          summary: 'Resumen de prueba Bloque 2',
          body: '<p>Cuerpo de prueba</p>',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('DRAFT');
      contentId = res.body.id;
    });
  });

  describe('Paso 2 — Crear fuente y validación institucional', () => {
    it('debe crear una fuente oficial externa', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/sources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'OFFICIAL_EXTERNAL',
          name: 'OMS',
          organization: 'Organización Mundial de la Salud',
          url: 'https://www.who.int',
          isOfficial: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      sourceId = res.body.id;
    });

    it('debe crear una validación aprobada asociada a la fuente', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/validations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'AUTHENTICITY',
          result: 'APPROVED',
          sourceId,
          summary: 'Documento verificado institucionalmente',
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.result).toBe('APPROVED');
      validationId = res.body.id;
    });
  });

  describe('Paso 3 — Asociar fuente y validación al contenido', () => {
    it('debe asociar la fuente al contenido', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentId}/sources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceIds: [sourceId] });

      expect(res.status).toBe(201);
      expect(res.body.sources).toHaveLength(1);
      expect(res.body.sources[0].id).toBe(sourceId);
    });

    it('debe asociar la validación al contenido', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentId}/validations`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ validationIds: [validationId] });

      expect(res.status).toBe(201);
      expect(res.body.validations).toHaveLength(1);
      expect(res.body.validations[0].id).toBe(validationId);
    });
  });

  describe('Paso 4 — Preparar contenido para publicación', () => {
    it('debe cambiar status a PREPARED', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'PREPARED' });

      expect(res.status).toBe(200);
    });

    it('debe cambiar status a READY_FOR_PUBLICATION', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('READY_FOR_PUBLICATION');
    });
  });

  describe('Paso 5 — Elegibilidad de publicación (reglas de negocio)', () => {
    let contentSinFuente: string;
    let contentSinValidacion: string;
    let contentValidacionRechazada: string;

    it('debe rechazar publicación si falta institutionalResponsibility', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentId}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('responsabilidad institucional');
    });

    it('debe rechazar publicación si el contenido no tiene fuentes', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Sin fuente ${uniqueId}`,
        });
      contentSinFuente = created.body.id;

      await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentSinFuente}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentSinFuente}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('fuente');
    });

    it('debe rechazar publicación si el contenido no tiene validaciones', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Sin validación ${uniqueId}`,
        });
      contentSinValidacion = created.body.id;

      await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentSinValidacion}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentSinValidacion}/sources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceIds: [sourceId] });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentSinValidacion}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('validación');
    });

    it('debe rechazar publicación si ninguna validación está APPROVED', async () => {
      const valRes = await request(app.getHttpServer())
        .post('/api/v1/admin/validations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'INSTITUTIONAL_COMPLETE',
          result: 'REJECTED',
          summary: 'Validación rechazada',
        });
      const rejectedValId = valRes.body.id;

      const created = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Validación rechazada ${uniqueId}`,
        });
      contentValidacionRechazada = created.body.id;

      await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${contentValidacionRechazada}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentValidacionRechazada}/sources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceIds: [sourceId] });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentValidacionRechazada}/validations`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ validationIds: [rejectedValId] });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentValidacionRechazada}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('aprobada');
    });
  });

  describe('Paso 6 — Publicación exitosa con todos los requisitos', () => {
    it('debe crear la publicación con institutionalResponsibility', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${contentId}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('PUBLISHED');
      expect(res.body.isVisible).toBe(true);
      expect(res.body.institutionalResponsibility).toBe(
        'Jurisdicción Sanitaria de Huejutla de Reyes',
      );
      publicationId = res.body.id;
      publicSlug = res.body.publicSlug;
    });

    it('debe exponer institutionalResponsibility en la respuesta administrativa', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/admin/publications/${publicationId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.institutionalResponsibility).toBe(
        'Jurisdicción Sanitaria de Huejutla de Reyes',
      );
    });
  });

  describe('Paso 7 — Contrato público: solo metadatos autorizados', () => {
    it('lista pública debe contener la publicación activa', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      const slugs = res.body.data.map((p: any) => p.publicSlug);
      expect(slugs).toContain(publicSlug);
    });

    it('lista pública debe exponer institutionalResponsibility', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      const pub = res.body.data.find((p: any) => p.publicSlug === publicSlug);
      expect(pub).toBeDefined();
      expect(pub.institutionalResponsibility).toBe(
        'Jurisdicción Sanitaria de Huejutla de Reyes',
      );
    });

    it('detalle público por slug debe funcionar', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/public/publications/${publicSlug}`);

      expect(res.status).toBe(200);
      expect(res.body.publicSlug).toBe(publicSlug);
      expect(res.body.institutionalResponsibility).toBe(
        'Jurisdicción Sanitaria de Huejutla de Reyes',
      );
    });

    it('publicación retirada debe ocultarse del endpoint público', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/admin/publications/${publicationId}/withdrawal`)
        .set('Authorization', `Bearer ${accessToken}`);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      const slugs = res.body.data.map((p: any) => p.publicSlug);
      expect(slugs).not.toContain(publicSlug);
    });

    it('publicación archivada debe ocultarse del endpoint público', async () => {
      const archivedContentRes = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Para archivar ${uniqueId}`,
        });
      const archivedContentId = archivedContentRes.body.id;

      await request(app.getHttpServer())
        .patch(`/api/v1/admin/contents/${archivedContentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'READY_FOR_PUBLICATION' });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${archivedContentId}/sources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceIds: [sourceId] });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${archivedContentId}/validations`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ validationIds: [validationId] });

      const archivePubRes = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${archivedContentId}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });
      const archivedPubId = archivePubRes.body.id;
      const archivedSlug = archivePubRes.body.publicSlug;

      await request(app.getHttpServer())
        .post(`/api/v1/admin/publications/${archivedPubId}/archive`)
        .set('Authorization', `Bearer ${accessToken}`);

      const res = await request(app.getHttpServer())
        .get('/api/v1/public/publications');

      const slugs = res.body.data.map((p: any) => p.publicSlug);
      expect(slugs).not.toContain(archivedSlug);
    });

    it('contenido borrador no debe tener publicación', async () => {
      const draftRes = await request(app.getHttpServer())
        .post('/api/v1/admin/contents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          contentTypeId,
          title: `Borrador ${uniqueId}`,
        });
      const draftId = draftRes.body.id;

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/contents/${draftId}/publication`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          institutionalResponsibility: 'Jurisdicción Sanitaria de Huejutla de Reyes',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('READY_FOR_PUBLICATION');
    });
  });

  describe('Paso 8 — Fuentes públicas activas', () => {
    it('debe listar fuentes activas no eliminadas', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/sources');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      const sourceNames = res.body.map((s: any) => s.name);
      expect(sourceNames).toContain('OMS');
    });

    it('fuente eliminada no debe aparecer en listado público', async () => {
      const newSourceRes = await request(app.getHttpServer())
        .post('/api/v1/admin/sources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'INSTITUTIONAL_INTERNAL',
          name: `Fuente Temporal ${uniqueId}`,
        });
      const tempSourceId = newSourceRes.body.id;

      const beforeDelete = await request(app.getHttpServer())
        .get('/api/v1/public/sources');
      const namesBefore = beforeDelete.body.map((s: any) => s.name);
      expect(namesBefore).toContain(`Fuente Temporal ${uniqueId}`);

      await request(app.getHttpServer())
        .delete(`/api/v1/admin/sources/${tempSourceId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const afterDelete = await request(app.getHttpServer())
        .get('/api/v1/public/sources');
      const namesAfter = afterDelete.body.map((s: any) => s.name);
      expect(namesAfter).not.toContain(`Fuente Temporal ${uniqueId}`);
    });
  });

  describe('Paso 9 — Categorías, etiquetas y tipos públicos', () => {
    it('debe listar categorías activas públicas', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/categories');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('debe listar etiquetas activas públicas', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/tags');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('debe listar tipos de contenido activos públicos', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/public/content-types');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});

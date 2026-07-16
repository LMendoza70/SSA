import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { SourceType } from '../generated/prisma/client';

describe('Source + Validation + Content Integration (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@jurisdiccion.com', password: 'Admin123!' });

    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  let sourceId: string;

  it('should create a source', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/sources')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: SourceType.OFFICIAL_EXTERNAL,
        name: 'Organizacion Mundial de la Salud',
        organization: 'OMS',
        url: 'https://www.who.int',
        isOfficial: true,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Organizacion Mundial de la Salud');
    sourceId = res.body.id;
  });

  it('should list sources', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/sources')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('should get source by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/admin/sources/${sourceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.id).toBe(sourceId);
  });

  it('should update a source', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/admin/sources/${sourceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'OMS - Updated' })
      .expect(200);

    expect(res.body.name).toBe('OMS - Updated');
  });

  let validationId: string;

  it('should create a validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/validations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'AUTHENTICITY',
        result: 'APPROVED',
        sourceId,
        summary: 'Documento verificado por el comite',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.type).toBe('AUTHENTICITY');
    validationId = res.body.id;
  });

  it('should list validations', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/validations')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
  });

  let contentId: string;

  it('should create content and associate source + validation', async () => {
    const contentTypes = await prisma.contentType.findMany({ take: 1 });
    if (contentTypes.length === 0) return;

    const contentRes = await request(app.getHttpServer())
      .post('/api/v1/admin/contents')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        contentTypeId: contentTypes[0].id,
        title: 'Contenido con fuente y validacion',
        summary: 'Resumen de prueba',
      })
      .expect(201);

    contentId = contentRes.body.id;
    expect(contentRes.body.sources).toEqual([]);
    expect(contentRes.body.validations).toEqual([]);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/contents/${contentId}/sources`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ sourceIds: [sourceId] })
      .expect(201);

    const afterSource = await request(app.getHttpServer())
      .get(`/api/v1/admin/contents/${contentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(afterSource.body.sources).toHaveLength(1);
    expect(afterSource.body.sources[0].id).toBe(sourceId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/contents/${contentId}/validations`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ validationIds: [validationId] })
      .expect(201);

    const afterVal = await request(app.getHttpServer())
      .get(`/api/v1/admin/contents/${contentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(afterVal.body.validations).toHaveLength(1);
    expect(afterVal.body.validations[0].id).toBe(validationId);
  });

  it('should have traceability records for source and validation', async () => {
    const sourceTrace = await request(app.getHttpServer())
      .get(`/api/v1/admin/traceability-records?sourceId=${sourceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(sourceTrace.body.length).toBeGreaterThanOrEqual(1);
    expect(sourceTrace.body.some((r: any) => r.sourceId === sourceId)).toBe(true);

    const valTrace = await request(app.getHttpServer())
      .get(`/api/v1/admin/traceability-records?validationId=${validationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(valTrace.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should allow removing source association and validation', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/admin/contents/${contentId}/sources/${sourceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const content = await request(app.getHttpServer())
      .get(`/api/v1/admin/contents/${contentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(content.body.sources).toHaveLength(0);

    await request(app.getHttpServer())
      .delete(`/api/v1/admin/contents/${contentId}/validations/${validationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const content2 = await request(app.getHttpServer())
      .get(`/api/v1/admin/contents/${contentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(content2.body.validations).toHaveLength(0);
  });
});

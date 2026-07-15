import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  app.use(cookieParser());
  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SSA API')
    .setDescription('API de la Plataforma de Gestión, Comunicación y Educación para la Salud')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();

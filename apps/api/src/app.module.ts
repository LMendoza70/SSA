import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContentModule } from './content/content.module';
import { PublicationModule } from './publication/publication.module';
import { PublicModule } from './public/public.module';
import { MediaModule } from './media/media.module';
import { ClassificationModule } from './classification/classification.module';
import { CampaignDiseaseModule } from './campaign-disease/campaign-disease.module';
import { TimelineModule } from './timeline/timeline.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
    PublicationModule,
    PublicModule,
    MediaModule,
    ClassificationModule,
    CampaignDiseaseModule,
    TimelineModule,
  ],
})
export class AppModule {}

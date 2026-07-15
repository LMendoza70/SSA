import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContentModule } from './content/content.module';
import { PublicationModule } from './publication/publication.module';
import { PublicModule } from './public/public.module';
import { MediaModule } from './media/media.module';
import { ClassificationModule } from './classification/classification.module';
import { CampaignDiseaseModule } from './campaign-disease/campaign-disease.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
    PublicationModule,
    PublicModule,
    MediaModule,
    ClassificationModule,
    CampaignDiseaseModule,
  ],
})
export class AppModule {}

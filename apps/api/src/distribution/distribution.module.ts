import { Module } from '@nestjs/common';
import { DistributionController } from './distribution.controller';
import { DistributionService } from './distribution.service';
import { SocialPublisherFactory } from './adapters/publisher-factory';
import { FacebookAdapter } from './adapters/facebook.adapter';
import { InstagramAdapter } from './adapters/instagram.adapter';
import { XAdapter } from './adapters/x.adapter';
import { TikTokAdapter } from './adapters/tiktok.adapter';
import { YouTubeAdapter } from './adapters/youtube.adapter';
import { WhatsAppAdapter } from './adapters/whatsapp.adapter';
import { SocialCredentialsModule } from './social-credentials/social-credentials.module';

@Module({
  imports: [SocialCredentialsModule],
  controllers: [DistributionController],
  providers: [
    DistributionService,
    SocialPublisherFactory,
    FacebookAdapter,
    InstagramAdapter,
    XAdapter,
    TikTokAdapter,
    YouTubeAdapter,
    WhatsAppAdapter,
  ],
  exports: [DistributionService, SocialCredentialsModule],
})
export class DistributionModule {}
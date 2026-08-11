import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class TikTokAdapter implements SocialPublisher {
  readonly channelType = 'TIKTOK';
  private readonly logger = new Logger(TikTokAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando publicación en TikTok: "${content.title}"`);
    return {
      success: true,
      externalPostId: `tt_stub_${Date.now()}`,
      publishedAt: new Date(),
    };
  }
}

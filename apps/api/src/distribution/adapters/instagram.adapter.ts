import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class InstagramAdapter implements SocialPublisher {
  readonly channelType = 'INSTAGRAM';
  private readonly logger = new Logger(InstagramAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando publicación en Instagram: "${content.title}"`);
    return {
      success: true,
      externalPostId: `ig_stub_${Date.now()}`,
      publishedAt: new Date(),
    };
  }
}

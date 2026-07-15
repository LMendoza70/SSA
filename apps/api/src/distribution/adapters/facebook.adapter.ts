import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class FacebookAdapter implements SocialPublisher {
  readonly channelType = 'FACEBOOK';
  private readonly logger = new Logger(FacebookAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando publicación en Facebook: "${content.title}"`);
    return {
      success: true,
      externalPostId: `fb_stub_${Date.now()}`,
      externalPostUrl: `https://facebook.com/stub/${Date.now()}`,
      publishedAt: new Date(),
    };
  }
}

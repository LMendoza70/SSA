import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class XAdapter implements SocialPublisher {
  readonly channelType = 'X';
  private readonly logger = new Logger(XAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando publicación en X: "${content.title}"`);
    return {
      success: true,
      externalPostId: `x_stub_${Date.now()}`,
      externalPostUrl: `https://x.com/stub/${Date.now()}`,
      publishedAt: new Date(),
    };
  }
}

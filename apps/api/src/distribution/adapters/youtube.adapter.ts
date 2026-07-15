import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class YouTubeAdapter implements SocialPublisher {
  readonly channelType = 'YOUTUBE';
  private readonly logger = new Logger(YouTubeAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando publicación en YouTube: "${content.title}"`);
    return {
      success: true,
      externalPostId: `yt_stub_${Date.now()}`,
      externalPostUrl: `https://youtube.com/watch?v=stub_${Date.now()}`,
      publishedAt: new Date(),
    };
  }
}

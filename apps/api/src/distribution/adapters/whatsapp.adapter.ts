import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';

@Injectable()
export class WhatsAppAdapter implements SocialPublisher {
  readonly channelType = 'WHATSAPP';
  private readonly logger = new Logger(WhatsAppAdapter.name);

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Simulando envío por WhatsApp: "${content.title}"`);
    return {
      success: true,
      publishedAt: new Date(),
    };
  }
}

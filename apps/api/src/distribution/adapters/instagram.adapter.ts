import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';
import { InstagramApiService } from '../social-credentials/instagram-api.client';
import { isPublicUrl } from '../social-credentials/social-url.util';

@Injectable()
export class InstagramAdapter implements SocialPublisher {
  readonly channelType = 'INSTAGRAM';
  private readonly logger = new Logger(InstagramAdapter.name);

  constructor(private readonly instagramApi: InstagramApiService) {}

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Publicando en Instagram: "${content.title}"`);

    const caption = this.buildCaption(content);

    // Instagram exige siempre una URL pública para la imagen/video.
    if (!isPublicUrl(content.temporalImageUrl)) {
      return {
        success: false,
        errorMessage:
          'Instagram: obligatorio proveer una URL pública de la imagen (urlImagenTemporal). localhost no es accesible para Meta.',
        publishedAt: new Date(),
      };
    }

    const imageUrl = content.temporalImageUrl!;

    try {
      const result = await this.instagramApi.createImagePost(imageUrl, caption);
      return {
        success: true,
        externalPostId: result.id,
        externalPostUrl: `https://instagram.com/p/${result.id}`,
        publishedAt: new Date(),
      };
    } catch (err) {
      this.logger.error(`Error publicando en Instagram: ${(err as Error).message}`);
      return {
        success: false,
        errorMessage: (err as Error).message,
        publishedAt: new Date(),
      };
    }
  }

  private buildCaption(content: PublishableContent): string {
    const lines: string[] = [];
    if (content.title) lines.push(content.title);
    if (content.summary) lines.push(content.summary);
    if (content.publicUrl && isPublicUrl(content.publicUrl)) {
      lines.push(`Más información en nuestra página`);
    } else if (content.publicSlug) {
      lines.push(content.publicSlug);
    }
    return lines.join('\n\n');
  }
}
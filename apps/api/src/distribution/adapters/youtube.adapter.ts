import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';
import { YouTubeApiService } from '../social-credentials/youtube-api.client';

@Injectable()
export class YouTubeAdapter implements SocialPublisher {
  readonly channelType = 'YOUTUBE';
  private readonly logger = new Logger(YouTubeAdapter.name);

  constructor(private readonly youtubeApi: YouTubeApiService) {}

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Publicando en YouTube: "${content.title}"`);

    const videoMedia = content.mediaUrls?.find((m) =>
      m.mimeType?.startsWith('video/'),
    );

    if (!videoMedia) {
      return {
        success: false,
        errorMessage: 'YouTube: se requiere un archivo de video para publicar',
        publishedAt: new Date(),
      };
    }

    try {
      const tags = this.extractTags(content);
      const description = this.buildDescription(content);

      const result = await this.youtubeApi.uploadVideo(
        videoMedia.url,
        content.title,
        description,
        tags,
        'public',
      );

      return {
        success: true,
        externalPostId: result.id,
        externalPostUrl: result.url,
        publishedAt: new Date(),
      };
    } catch (err) {
      this.logger.error(`Error publicando en YouTube: ${(err as Error).message}`);
      return {
        success: false,
        errorMessage: (err as Error).message,
        publishedAt: new Date(),
      };
    }
  }

  private extractTags(content: PublishableContent): string[] {
    const tags: string[] = [];
    if (content.institutionalResponsibility) {
      tags.push('Salud', 'Jurisdicción Sanitaria');
    }
    if (content.summary) {
      const words = content.summary
        .split(/\s+/)
        .filter((w) => w.length > 4)
        .slice(0, 5);
      tags.push(...words);
    }
    if (content.publicUrl) {
      tags.push('Más información en descripción');
    }
    return tags;
  }

  private buildDescription(content: PublishableContent): string {
    const lines: string[] = [];
    if (content.summary) lines.push(content.summary);
    if (content.body) lines.push(content.body.substring(0, 1000));
    if (content.institutionalResponsibility) {
      lines.push(`Responsabilidad institucional: ${content.institutionalResponsibility}`);
    }
    if (content.publicUrl) lines.push(`Más información: ${content.publicUrl}`);
    return lines.join('\n\n');
  }
}
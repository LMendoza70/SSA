import { Injectable, Logger } from '@nestjs/common';
import { SocialPublisher, PublishableContent, PublishResult } from './social-publisher.interface';
import { FacebookApiService } from '../social-credentials/facebook-api.client';
import { isPublicUrl } from '../social-credentials/social-url.util';

@Injectable()
export class FacebookAdapter implements SocialPublisher {
  readonly channelType = 'FACEBOOK';
  private readonly logger = new Logger(FacebookAdapter.name);

  constructor(private readonly facebookApi: FacebookApiService) {}

  async publish(content: PublishableContent): Promise<PublishResult> {
    this.logger.log(`Publicando en Facebook: "${content.title}"`);

    const hasVideo = content.mediaUrls?.some((m) =>
      m.mimeType?.startsWith('video/'),
    );
    const hasImage = content.mediaUrls?.some((m) =>
      m.mimeType?.startsWith('image/'),
    );

    const caption = this.buildCaption(content);

    try {
      if (hasVideo && content.mediaUrls) {
        const video = content.mediaUrls.find((m) => m.mimeType?.startsWith('video/'));
        if (!video!.filePath) {
          throw new Error(
            'Facebook: no se encontró el archivo de video local. La URL pública no está disponible para Facebook.',
          );
        }
        const result = await this.facebookApi.postVideo(
          video!.url,
          content.title,
          caption,
          video!.filePath,
        );
        return this.toResult(result.id, `https://facebook.com/${result.id}`, true);
      }

      if (hasImage && (content.mediaUrls || content.temporalImageUrl)) {
        const image =
          content.mediaUrls?.find((m) => m.mimeType?.startsWith('image/')) ?? undefined;
        // Prioridad: URL de imagen temporal (pública) o archivo local.
        const imageUrl = content.temporalImageUrl || image?.url;
        if (!imageUrl) {
          throw new Error(
            'Facebook: no se encontró una imagen para publicar.',
          );
        }
        if (content.temporalImageUrl) {
          // Imagen provista por la app de almacenamiento/URL pública: subir por URL.
          const result = await this.facebookApi.postPhoto(imageUrl, caption);
          return this.toResult(result.id, `https://facebook.com/${result.id}`, true);
        }
        if (!image!.filePath) {
          throw new Error(
            'Facebook: no se encontró el archivo de imagen local. La URL pública no está disponible para Facebook.',
          );
        }
        const result = await this.facebookApi.postPhoto(imageUrl, caption, image!.filePath);
        return this.toResult(result.id, `https://facebook.com/${result.id}`, true);
      }

      const result = await this.facebookApi.postText(caption, content.publicUrl);
      return this.toResult(result.id, `https://facebook.com/${result.id}`, true);
    } catch (err) {
      this.logger.error(`Error publicando en Facebook: ${(err as Error).message}`);
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
      lines.push(`Más información: ${content.publicUrl}`);
    } else if (content.publicSlug) {
      // En desarrollo el enlace es localhost; se deja el slug como texto plano.
      lines.push(content.publicSlug);
    }
    return lines.join('\n\n');
  }

  private toResult(
    postId: string,
    url: string,
    success: boolean,
  ): PublishResult {
    return {
      success,
      externalPostId: postId,
      externalPostUrl: url,
      publishedAt: new Date(),
    };
  }
}
import { Injectable } from '@nestjs/common';

export interface MediaAttachment {
  url: string;
  mimeType: string;
  type: 'image' | 'video' | 'document' | 'other';
}

export enum ContentShape {
  TEXT_ONLY = 'TEXT_ONLY',
  WITH_IMAGES = 'WITH_IMAGES',
  WITH_VIDEO = 'WITH_VIDEO',
}

export interface PlatformEligibility {
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE';
  allowed: boolean;
  reason?: string;
}

export interface ClassificationResult {
  profile: ContentShape;
  attachments: MediaAttachment[];
  eligiblePlatforms: PlatformEligibility[];
}

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-matroska',
]);

function detectMimeTypeFromUrl(url: string): string {
  const path = url.split('?')[0].toLowerCase();
  if (path.endsWith('.mp4')) return 'video/mp4';
  if (path.endsWith('.mov')) return 'video/quicktime';
  if (path.endsWith('.avi')) return 'video/x-msvideo';
  if (path.endsWith('.webm')) return 'video/webm';
  if (path.endsWith('.mkv')) return 'video/x-matroska';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

@Injectable()
export class ContentAnalyzer {
  classifyMedia(mediaUrls: string[]): ClassificationResult {
    const attachments: MediaAttachment[] = mediaUrls.map((url) => {
      const mimeType = detectMimeTypeFromUrl(url);
      return { url, mimeType, type: this.detectType(mimeType) };
    });

    const hasVideo = attachments.some((a) => a.type === 'video');
    const hasImage = attachments.some((a) => a.type === 'image');

    let profile: ContentShape;
    if (hasVideo) {
      profile = ContentShape.WITH_VIDEO;
    } else if (hasImage) {
      profile = ContentShape.WITH_IMAGES;
    } else {
      profile = ContentShape.TEXT_ONLY;
    }

    const eligiblePlatforms = this.getEligiblePlatforms(profile);

    return { profile, attachments, eligiblePlatforms };
  }

  private detectType(mimeType: string): 'image' | 'video' | 'document' | 'other' {
    if (IMAGE_MIME_TYPES.has(mimeType)) return 'image';
    if (VIDEO_MIME_TYPES.has(mimeType)) return 'video';
    if (mimeType === 'application/pdf' ||
      mimeType.includes('word') ||
      mimeType.includes('officedocument')) return 'document';
    return 'other';
  }

  getEligiblePlatforms(profile: ContentShape): PlatformEligibility[] {
    return [
      { platform: 'FACEBOOK', allowed: true },
      {
        platform: 'INSTAGRAM',
        allowed: profile === ContentShape.WITH_IMAGES || profile === ContentShape.WITH_VIDEO,
        reason:
          profile === ContentShape.TEXT_ONLY
            ? 'Instagram requiere al menos una imagen o video'
            : undefined,
      },
      {
        platform: 'YOUTUBE',
        allowed: profile === ContentShape.WITH_VIDEO,
        reason:
          profile !== ContentShape.WITH_VIDEO
            ? 'YouTube solo está habilitado para contenido con video'
            : undefined,
      },
    ];
  }
}
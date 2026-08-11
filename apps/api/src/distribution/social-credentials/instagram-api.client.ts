import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { SocialCredentialService } from '../social-credentials/social-credential.service';

const API_VERSION = 'v22.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export { VIDEO_MIME_TYPES, IMAGE_MIME_TYPES };

export interface InstagramPostResult {
  id: string;
}

@Injectable()
export class InstagramApiService {
  private readonly logger = new Logger(InstagramApiService.name);

  constructor(private readonly credentialService: SocialCredentialService) {}

  private async getToken(): Promise<string> {
    const token = await this.credentialService.getCredential('instagram', 'page_token');
    if (!token) throw new Error('Instagram: page_token no configurado');
    return token;
  }

  private async getAccountId(): Promise<string> {
    const id = await this.credentialService.getCredential('instagram', 'account_id');
    if (!id) throw new Error('Instagram: account_id no configurado');
    return id;
  }

  async validateConnection(): Promise<{ valid: boolean }> {
    try {
      const token = await this.getToken();
      const accountId = await this.getAccountId();
      const { data } = await axios.get(`${BASE_URL}/${accountId}`, {
        params: { fields: 'id,username', access_token: token },
      });
      return { valid: true };
    } catch (err) {
      const axiosErr = err as AxiosError;
      const bizErr = (axiosErr.response?.data as any)?.error;
      if (bizErr?.code === 190 || bizErr?.code === 463 || bizErr?.code === 464) {
        throw new UnauthorizedException(
          'Token de Instagram caducado. Por favor reautentica la aplicación.',
        );
      }
      throw err;
    }
  }

  async createImagePost(
    imageUrl: string,
    caption: string,
  ): Promise<InstagramPostResult> {
    await this.validateConnection();
    const accountId = await this.getAccountId();
    const token = await this.getToken();

    try {
      const { data } = await axios.post(`${BASE_URL}/${accountId}/media`, {
        image_url: imageUrl,
        caption,
        access_token: token,
      });
      const containerId = (data as { id: string }).id;

      await this.pollForFinish(containerId);

      const pubRes = await axios.post(`${BASE_URL}/${accountId}/media_publish`, {
        creation_id: containerId,
        access_token: token,
      });
      this.logger.log(`Instagram image publicado: ${(pubRes.data as any).id}`);
      return pubRes.data as InstagramPostResult;
    } catch (err) {
      throw this.wrapInstagramError(err, 'Instagram');
    }
  }

  async createReelsPost(
    videoUrl: string,
    caption: string,
  ): Promise<InstagramPostResult> {
    await this.validateConnection();
    const accountId = await this.getAccountId();
    const token = await this.getToken();

    try {
      const { data } = await axios.post(`${BASE_URL}/${accountId}/media`, {
        media_type: 'REELS',
        video_url: videoUrl,
        caption,
        access_token: token,
      });
      const containerId = (data as { id: string }).id;

      await this.pollForFinish(containerId);

      const pubRes = await axios.post(`${BASE_URL}/${accountId}/media_publish`, {
        creation_id: containerId,
        access_token: token,
      });
      this.logger.log(`Instagram reels publicado: ${(pubRes.data as any).id}`);
      return pubRes.data as InstagramPostResult;
    } catch (err) {
      throw this.wrapInstagramError(err, 'Instagram');
    }
  }

  private async getMediaStatus(containerId: string): Promise<string> {
    const token = await this.getToken();
    const { data } = await axios.get(`${BASE_URL}/${containerId}`, {
      params: { fields: 'status_code', access_token: token },
    });
    return (data as { status_code: string }).status_code;
  }

  private async pollForFinish(
    containerId: string,
    maxAttempts = 30,
    intervalMs = 10000,
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      const status = await this.getMediaStatus(containerId);
      if (status === 'FINISHED') return;
      if (status === 'ERROR' || status === 'EXPIRED') {
        throw new Error(`Instagram: el procesamiento de medios falló (${status})`);
      }
    }
    throw new Error('Instagram: tiempo de espera excedido al procesar medios');
  }

  private wrapInstagramError(err: unknown, platform: string): Error {
    const axiosErr = err as AxiosError;
    const igError = (axiosErr.response?.data as any)?.error;
    if (igError) {
      const msg = igError.error_user_msg || igError.message || igError.type || 'Error desconocido';
      this.logger.error(`${platform} API error [${igError.code}]: ${msg}`);
      return new Error(`${platform}: ${msg} (código ${igError.code})`);
    }
    if (axiosErr.response) {
      return new Error(`${platform}: HTTP ${axiosErr.response.status} - ${axiosErr.response.statusText}`);
    }
    return new Error(`${platform}: ${(err as Error).message}`);
  }
}
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { SocialCredentialService } from '../social-credentials/social-credential.service';
import { isPublicUrl } from '../social-credentials/social-url.util';

const API_VERSION = 'v22.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export interface FacebookPostResult {
  id: string;
  post_id?: string;
}

@Injectable()
export class FacebookApiService {
  private readonly logger = new Logger(FacebookApiService.name);

  constructor(private readonly credentialService: SocialCredentialService) {}

  private async getToken(): Promise<{ pageToken: string; pageId: string }> {
    const pageToken = await this.credentialService.getCredential('facebook', 'page_token');
    const pageId = await this.credentialService.getCredential('facebook', 'page_id');
    if (!pageToken || !pageId) {
      throw new Error('Facebook: token de pÃ¡gina o page_id no configurado');
    }
    return { pageToken, pageId };
  }

  async validateConnection(): Promise<{ valid: boolean; expiresAt?: string }> {
    try {
      const { pageToken, pageId } = await this.getToken();
      const { data } = await axios.get(`${BASE_URL}/${pageId}`, {
        params: {
          fields: 'id,name,access_token',
          access_token: pageToken,
        },
      });
      return { valid: true };
    } catch (err) {
      const axiosErr = err as AxiosError;
      const fbError = (axiosErr.response?.data as any)?.error;
      if (fbError?.code === 190 || fbError?.code === 463 || fbError?.code === 464) {
        throw new UnauthorizedException(
          'Token de Facebook caducado. Por favor reautentica la aplicaciÃ³n.',
        );
      }
      throw err;
    }
  }

  async postText(message: string, link?: string): Promise<FacebookPostResult> {
    await this.validateConnection();
    const { pageToken, pageId } = await this.getToken();
    const body: Record<string, string> = { message, access_token: pageToken };
    // Solo adjuntar enlace si es una URL pÃºblica accesible para Meta.
    // URLs de localhost no pueden ser analizadas y causan error 1500.
    if (link && isPublicUrl(link)) body.link = link;
    try {
      const { data } = await axios.post(`${BASE_URL}/${pageId}/feed`, body);
      this.logger.log(`Facebook text post publicado: ${(data as any).id}`);
      return data as FacebookPostResult;
    } catch (err) {
      throw this.wrapFacebookError(err, 'Facebook');
    }
  }

  async postPhoto(
    imageUrl: string,
    message?: string,
    filePath?: string,
  ): Promise<FacebookPostResult> {
    await this.validateConnection();
    const { pageToken, pageId } = await this.getToken();
    try {
      if (filePath) {
        const buffer = await readFile(filePath);
        const form = new FormData();
        form.append('access_token', pageToken);
        form.append('source', new Blob([buffer]), basename(filePath));
        if (message) form.append('message', message);
        const { data } = await axios.post(`${BASE_URL}/${pageId}/photos`, form);
        this.logger.log(`Facebook photo post publicado: ${(data as any).id}`);
        return data as FacebookPostResult;
      }
      // Sin archivo local solo se puede usar URL pÃºblica; localhost causa 1500.
      if (!isPublicUrl(imageUrl)) {
        throw new Error(
          'Facebook: no se encontrÃ³ el archivo local para subir y la URL pÃºblica no es accesible por Meta (localhost).',
        );
      }
      const body: Record<string, string> = { url: imageUrl, access_token: pageToken };
      if (message) body.message = message;
      const { data } = await axios.post(`${BASE_URL}/${pageId}/photos`, body);
      this.logger.log(`Facebook photo post publicado: ${(data as any).id}`);
      return data as FacebookPostResult;
    } catch (err) {
      throw this.wrapFacebookError(err, 'Facebook');
    }
  }

  async postVideo(
    videoUrl: string,
    title: string,
    description?: string,
    filePath?: string,
  ): Promise<FacebookPostResult> {
    await this.validateConnection();
    const { pageToken, pageId } = await this.getToken();
    try {
      if (filePath) {
        const buffer = await readFile(filePath);
        const form = new FormData();
        form.append('access_token', pageToken);
        form.append('source', new Blob([buffer]), basename(filePath));
        form.append('title', title);
        form.append('description', description ?? '');
        const { data } = await axios.post(`${BASE_URL}/${pageId}/videos`, form);
        this.logger.log(`Facebook video post publicado: ${(data as any).id}`);
        return data as FacebookPostResult;
      }
      if (!isPublicUrl(videoUrl)) {
        throw new Error(
          'Facebook: no se encontrÃ³ el archivo local para subir y la URL pÃºblica no es accesible por Meta (localhost).',
        );
      }
      const body: Record<string, string> = {
        file_url: videoUrl,
        title,
        access_token: pageToken,
      };
      if (description) body.description = description;
      const { data } = await axios.post(`${BASE_URL}/${pageId}/videos`, body);
      this.logger.log(`Facebook video post publicado: ${(data as any).id}`);
      return data as FacebookPostResult;
    } catch (err) {
      throw this.wrapFacebookError(err, 'Facebook');
    }
  }

  async getMetrics(postId: string): Promise<{ likes: number; comments: number; shares: number }> {
    const { pageToken } = await this.getToken();
    const { data } = await axios.get(`${BASE_URL}/${postId}`, {
      params: {
        fields: 'likes.limit(0).summary(true),comments.limit(0).summary(true),shares',
        access_token: pageToken,
      },
    });
    return {
      likes: (data.likes?.summary?.total_count as number) ?? 0,
      comments: (data.comments?.summary?.total_count as number) ?? 0,
      shares: (data.shares?.count as number) ?? 0,
    };
  }

private wrapFacebookError(err: unknown, platform: string): Error {
    const axiosErr = err as AxiosError;
    const fbError = (axiosErr.response?.data as any)?.error;
    if (fbError) {
      const msg = fbError.error_user_msg || fbError.message || fbError.type || 'Error desconocido';
      this.logger.error(`${platform} API error [${fbError.code}]: ${msg}`);
      return new Error(`${platform}: ${msg} (cÃ³digo ${fbError.code})`);
    }
    if (axiosErr.response) {
      return new Error(`${platform}: HTTP ${axiosErr.response.status} - ${axiosErr.response.statusText}`);
    }
    return new Error(`${platform}: ${(err as Error).message}`);
  }
}

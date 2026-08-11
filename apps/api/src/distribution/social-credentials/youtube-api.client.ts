import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as https from 'node:https';
import * as http from 'node:http';
import { SocialCredentialService } from '../social-credentials/social-credential.service';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export interface YouTubeUploadResult {
  id: string;
  url: string;
}

@Injectable()
export class YouTubeApiService {
  private readonly logger = new Logger(YouTubeApiService.name);

  constructor(private readonly credentialService: SocialCredentialService) {}

  private async getAccessToken(): Promise<string> {
    const token = await this.credentialService.getCredential('youtube', 'access_token');
    if (!token) throw new Error('YouTube: access_token no configurado');
    return token;
  }

  async validateConnection(): Promise<{ valid: boolean; expiresAt?: string }> {
    try {
      const token = await this.getAccessToken();
      await axios.get(`${YOUTUBE_API_BASE}/channels?part=id&mine=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { valid: true };
    } catch (err) {
      const axiosErr = err as AxiosError;
      const data = axiosErr.response?.data as any;
      if (data?.error?.status === 'UNAUTHENTICATED' || axiosErr.response?.status === 401) {
        await this.tryRefreshToken();
        return this.validateConnection();
      }
      throw err;
    }
  }

  async tryRefreshToken(): Promise<string> {
    const refreshToken = await this.credentialService.getCredential('youtube', 'refresh_token');
    if (!refreshToken) {
      throw new UnauthorizedException(
        'YouTube: token caducado y refresh_token no disponible. Por favor reautentica la aplicación.',
      );
    }
    const clientId = await this.credentialService.getCredential('youtube', 'client_id');
    const clientSecret = await this.credentialService.getCredential('youtube', 'client_secret');
    if (!clientId || !clientSecret) {
      throw new Error('YouTube: client_id y client_secret requeridos para refrescar token');
    }

    try {
      const { data } = await axios.post(TOKEN_URL, null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      });
      const newAccessToken = (data as { access_token: string }).access_token;
      await this.credentialService.setCredentials('youtube', {
        access_token: newAccessToken,
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });
      this.logger.log('YouTube token refrescado exitosamente');
      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedException(
        `YouTube: error al refrescar token: ${(err as Error).message}`,
      );
    }
  }

  async uploadVideo(
    videoUrl: string,
    title: string,
    description: string,
    tags: string[],
    privacyStatus: 'public' | 'private' | 'unlisted' = 'public',
  ): Promise<YouTubeUploadResult> {
    await this.validateConnection();
    const token = await this.getAccessToken();

    const metadata = {
      snippet: { title, description, tags, categoryId: '22' },
      status: { privacyStatus },
    };

    try {
      const UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';

      const videoBuffer = await this.downloadFile(videoUrl);

      const initResponse = await axios.post(
        `${UPLOAD_URL}?uploadType=resumable&part=snippet,status`,
        metadata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': 'video/mp4',
            'X-Upload-Content-Length': String(videoBuffer.length),
          },
        },
      );

      const uploadUrl = initResponse.headers['location'] as string;
      if (!uploadUrl) throw new Error('YouTube: no se obtuvo URL de subida');

      const { data } = await axios.put(uploadUrl, videoBuffer, {
        headers: {
          'Content-Length': String(videoBuffer.length),
          'Content-Type': 'video/mp4',
        },
        maxBodyLength: Infinity,
      });

      const result = data as { id: string };
      this.logger.log(`YouTube video subido: ${result.id}`);
      return { id: result.id, url: `https://www.youtube.com/watch?v=${result.id}` };
    } catch (err) {
      throw this.wrapYouTubeError(err, 'YouTube');
    }
  }

  private async downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      lib
        .get(url, (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Error descargando archivo: HTTP ${res.statusCode}`));
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        })
        .on('error', reject);
    });
  }

  private wrapYouTubeError(err: unknown, platform: string): Error {
    const axiosErr = err as AxiosError;
    const data = axiosErr.response?.data as any;
    if (data?.error) {
      const msg = data.error.message || data.error.status || 'Error desconocido';
      this.logger.error(`${platform} API error: ${msg}`);
      return new Error(`${platform}: ${msg}`);
    }
    if (axiosErr.response) {
      return new Error(`${platform}: HTTP ${axiosErr.response.status} - ${axiosErr.response.statusText}`);
    }
    return new Error(`${platform}: ${(err as Error).message}`);
  }
}
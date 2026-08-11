import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SocialCredentialService } from './social-credential.service';

export interface OAuthUrls {
  authUrl: string;
}

export interface FacebookOAuthInput {
  appId: string;
  redirectUri: string;
}

export interface YouTubeOAuthInput {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface YouTubeTokenExchange {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

@Injectable()
export class SocialOAuthService {
  private readonly logger = new Logger(SocialOAuthService.name);

  constructor(private readonly credentialService: SocialCredentialService) {}

  generateFacebookAuthUrl(appId: string, redirectUri: string): string {
    const scopes = [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_manage_metadata',
      'instagram_basic',
      'instagram_content_publish',
    ];

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: scopes.join(','),
    });

    return `https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`;
  }

  generateYouTubeAuthUrl(clientId: string, redirectUri: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ];

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeYouTubeCode(code: string, clientId: string, clientSecret: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const { data } = await axios.post(TOKEN_URL, null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });

    const result = data as { access_token: string; refresh_token: string };

    await this.credentialService.setCredentials('youtube', {
      client_id: clientId,
      client_secret: clientSecret,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });

    this.logger.log('YouTube credentials stored via OAuth exchange');
    return result;
  }

  async resolveFacebookRedirectParams(hashParams: Record<string, string>): Promise<{
    pageToken: string;
    pageId: string;
    pageName: string;
    instagramAccountId?: string;
  }> {
    const accessToken = hashParams['access_token'];
    if (!accessToken) throw new Error('Facebook: access_token ausente en la respuesta');

    const pages = await this.fetchFacebookPages(accessToken);
    if (pages.length === 0) throw new Error('Facebook: no se encontraron páginas asociadas');

    const selectedPage = pages[0];
    const appId = await this.credentialService.getCredential('facebook', 'app_id');
    if (!appId) throw new Error('Facebook: app_id no configurado');

    const credentials: Record<string, string> = {
      app_id: appId,
      page_token: selectedPage.access_token,
      page_id: selectedPage.id,
      user_token: accessToken,
    };

    let instagramAccountId: string | undefined;

    try {
      const igId = await this.getInstagramBusinessAccount(selectedPage.id, selectedPage.access_token);
      if (igId) {
        credentials['account_id'] = igId;
        instagramAccountId = igId;
      }
    } catch {
      this.logger.warn('No se pudo obtener Instagram Business Account');
    }

    await this.credentialService.setCredentials('facebook', credentials);

    if (instagramAccountId) {
      await this.credentialService.setCredentials('instagram', {
        page_token: selectedPage.access_token,
        account_id: instagramAccountId,
      });
    }

    this.logger.log('Facebook credentials stored from OAuth');
    return {
      pageToken: selectedPage.access_token,
      pageId: selectedPage.id,
      pageName: selectedPage.name ?? '',
      instagramAccountId,
    };
  }

  async validateFacebookConfig(appId: string, redirectUri: string): Promise<SocialUrl> {
    const existingAppId = await this.credentialService.getCredential('facebook', 'app_id');
    const effectiveAppId = appId || existingAppId;
    if (!effectiveAppId) throw new Error('Facebook: app_id requerido');

    await this.credentialService.setCredentials('facebook', { app_id: effectiveAppId });

    return { url: this.generateFacebookAuthUrl(effectiveAppId, redirectUri) };
  }

  async validateYouTubeConfig(clientId: string, clientSecret: string, redirectUri: string): Promise<SocialUrl> {
    const existingClientId = await this.credentialService.getCredential('youtube', 'client_id');
    const existingClientSecret = await this.credentialService.getCredential('youtube', 'client_secret');

    const effectiveClientId = clientId || existingClientId;
    const effectiveClientSecret = clientSecret || existingClientSecret;

    if (!effectiveClientId || !effectiveClientSecret) {
      throw new Error('YouTube: client_id y client_secret requeridos');
    }

    await this.credentialService.setCredentials('youtube', {
      client_id: effectiveClientId,
      client_secret: effectiveClientSecret,
    });

    return { url: this.generateYouTubeAuthUrl(effectiveClientId, redirectUri) };
  }

  private async fetchFacebookPages(userToken: string): Promise<Array<{ id: string; name: string; access_token: string }>> {
    const { data } = await axios.get('https://graph.facebook.com/v22.0/me/accounts', {
      params: { access_token: userToken },
    });
    return (data.data as Array<{ id: string; name: string; access_token: string }>) ?? [];
  }

  private async getInstagramBusinessAccount(pageId: string, pageToken: string): Promise<string | null> {
    const { data } = await axios.get(`https://graph.facebook.com/v22.0/${pageId}`, {
      params: { fields: 'instagram_business_account{id}', access_token: pageToken },
    });
    return data.instagram_business_account?.id ?? null;
  }
}

export interface SocialUrl {
  url: string;
}
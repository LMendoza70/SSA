import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SocialCredentialService } from './social-credential.service';
import { SocialOAuthService } from './social-oauth.service';

class SetCredentialsDto {
  @IsObject()
  credentials!: Record<string, string>;
  @IsOptional()
  @IsString()
  description?: string;
}

class FacebookCallbackDto {
  @IsString()
  access_token!: string;
}

class FacebookAuthDto {
  @IsString()
  redirectUri!: string;
  @IsOptional()
  @IsString()
  appId?: string;
}

class YouTubeCallbackDto {
  @IsString()
  code!: string;
  @IsString()
  redirectUri!: string;
}

class YouTubeAuthDto {
  @IsString()
  redirectUri!: string;
  @IsOptional()
  @IsString()
  clientId?: string;
  @IsOptional()
  @IsString()
  clientSecret?: string;
}

@ApiTags('Admin / Social Credentials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/social-credentials')
export class SocialCredentialController {
  constructor(
    private readonly credentialService: SocialCredentialService,
    private readonly oauthService: SocialOAuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar plataformas con credenciales configuradas' })
  async listPlatforms() {
    return this.credentialService.listPlatforms();
  }

  @Post('upload-credentials')
  @ApiOperation({ summary: 'Cargar credenciales desde archivo JSON' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCredentials(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('Archivo no recibido');

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(file.buffer.toString('utf-8'));
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('El archivo debe contener un objeto JSON válido');
      }
    } catch (err) {
      throw new Error(`Error al parsear archivo JSON: ${(err as Error).message}`);
    }

    // Formato Google Cloud: {"web":{...}} o {"installed":{...}} o plano
    const root = data as Record<string, unknown>;
    let payload = root;
    if (root.web && typeof root.web === 'object') payload = root.web as Record<string, unknown>;
    else if (root.installed && typeof root.installed === 'object') payload = root.installed as Record<string, unknown>;

    const normalized: Record<string, string> = {};
    for (const key of Object.keys(payload)) {
      normalized[key.toLowerCase()] = String(payload[key] ?? '').trim();
    }

    let platform: string | null = null;
    const credentials: Record<string, string> = {};

    if (normalized.client_id && normalized.client_secret) {
      platform = 'youtube';
      credentials.client_id = normalized.client_id;
      credentials.client_secret = normalized.client_secret;
      credentials.project_id = normalized.project_id ?? '';
    } else if (normalized.app_id) {
      platform = 'facebook';
      credentials.app_id = normalized.app_id;
    } else {
      throw new Error(
        'Formato de archivo no reconocido. Debe contener "app_id" (Facebook) o "client_id" y "client_secret" (YouTube/Google).',
      );
    }

    await this.credentialService.setCredentials(platform, credentials);

    return {
      platform,
      message: `Credenciales cargadas para ${platform}`,
      keys: Object.keys(credentials),
    };
  }

  @Post('facebook/auth-url')
  @ApiOperation({ summary: 'Generar URL de autenticación de Facebook' })
  async getFacebookAuthUrl(@Body() dto: FacebookAuthDto) {
    return this.oauthService.validateFacebookConfig(dto.appId ?? '', dto.redirectUri);
  }

  @Post('facebook/callback')
  @ApiOperation({ summary: 'Procesar respuesta OAuth de Facebook y guardar tokens' })
  async facebookCallback(@Body() dto: FacebookCallbackDto) {
    const result = await this.oauthService.resolveFacebookRedirectParams({
      access_token: dto.access_token,
    });
    return result;
  }

  @Post('youtube/auth-url')
  @ApiOperation({ summary: 'Generar URL de autenticación de YouTube' })
  async getYouTubeAuthUrl(@Body() dto: YouTubeAuthDto) {
    return this.oauthService.validateYouTubeConfig(
      dto.clientId ?? '',
      dto.clientSecret ?? '',
      dto.redirectUri,
    );
  }

  @Post('youtube/callback')
  @ApiOperation({ summary: 'Intercambiar código OAuth de YouTube por tokens' })
  async youtubeCallback(@Body() dto: YouTubeCallbackDto) {
    const clientId = await this.credentialService.getCredential('youtube', 'client_id');
    const clientSecret = await this.credentialService.getCredential('youtube', 'client_secret');

    if (!clientId || !clientSecret) {
      throw new Error('YouTube: client_id y client_secret no configurados');
    }

    const result = await this.oauthService.exchangeYouTubeCode(
      dto.code,
      clientId,
      clientSecret,
      dto.redirectUri,
    );

    return result;
  }

  @Get(':platform/has/:key')
  @ApiOperation({ summary: 'Verificar si una clave de credencial existe' })
  async hasCredential(
    @Param('platform') platform: string,
    @Param('key') key: string,
  ) {
    const value = await this.credentialService.getCredential(platform, key);
    return { platform, key, exists: value !== null };
  }

  @Get(':platform')
  @ApiOperation({ summary: 'Obtener credenciales de una plataforma' })
  async getCredentials(@Param('platform') platform: string) {
    const credentials = await this.credentialService.getCredentials(platform);
    return { platform, configured: Object.keys(credentials).length > 0, keys: Object.keys(credentials) };
  }

  @Post(':platform')
  @ApiOperation({ summary: 'Guardar/actualizar credenciales de una plataforma' })
  async setCredentials(
    @Param('platform') platform: string,
    @Body() dto: SetCredentialsDto,
  ) {
    await this.credentialService.setCredentials(platform, dto.credentials, dto.description);
    return { platform, message: 'Credenciales guardadas exitosamente' };
  }

  @Delete(':platform')
  @ApiOperation({ summary: 'Eliminar credenciales de una plataforma' })
  async deleteCredentials(@Param('platform') platform: string) {
    await this.credentialService.deleteCredentials(platform);
    return { platform, message: 'Credenciales eliminadas exitosamente' };
  }
}
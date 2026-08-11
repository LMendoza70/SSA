import { Inject, Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, UpdateDistributionDto, PublishToSocialsDto } from './dto';
import { TraceabilityService } from '../traceability/traceability.service';
import { SocialPublisherFactory } from './adapters/publisher-factory';
import { ContentAnalyzer, ContentShape, PlatformEligibility } from './social-credentials/content-analyzer.service';
import { SocialCredentialService } from './social-credentials/social-credential.service';
import { MediaUrlInfo } from './adapters/social-publisher.interface';
import { PublicationStatus } from '../generated/prisma/client';

@Injectable()
export class DistributionService {
  private readonly logger = new Logger(DistributionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly publisherFactory: SocialPublisherFactory,
    private readonly traceability: TraceabilityService,
    private readonly contentAnalyzer: ContentAnalyzer,
    private readonly credentialService: SocialCredentialService,
  ) {}

  async createChannel(dto: CreateChannelDto) {
    return this.prisma.communicationChannel.create({ data: dto });
  }

  async findAllChannels() {
    return this.prisma.communicationChannel.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findChannelById(id: string) {
    const channel = await this.prisma.communicationChannel.findUnique({ where: { id } });
    if (!channel || channel.deletedAt) {
      throw new NotFoundException('Canal no encontrado');
    }
    return channel;
  }

  async updateChannel(id: string, dto: UpdateChannelDto) {
    const existing = await this.prisma.communicationChannel.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Canal no encontrado');
    }
    return this.prisma.communicationChannel.update({ where: { id }, data: dto });
  }

  async removeChannel(id: string) {
    const existing = await this.prisma.communicationChannel.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Canal no encontrado');
    }
    await this.prisma.communicationChannel.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getPublicationChannels(publicationId: string) {
    const items = await this.prisma.publicationChannel.findMany({
      where: { publicationId },
      include: { communicationChannel: true },
      orderBy: { createdAt: 'asc' },
    });
    return items.map((pc) => ({
      id: pc.id,
      channelId: pc.communicationChannelId,
      channel: pc.communicationChannel,
      status: pc.status,
      preparedText: pc.preparedText,
      preparedAt: pc.preparedAt?.toISOString(),
      sharedAt: pc.sharedAt?.toISOString(),
    }));
  }

  async associatePublicationChannels(publicationId: string, channelIds: string[]) {
    const publication = await this.prisma.publication.findUnique({ where: { id: publicationId } });
    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    for (const chId of channelIds) {
      const channel = await this.prisma.communicationChannel.findUnique({ where: { id: chId } });
      if (!channel || channel.deletedAt) {
        throw new NotFoundException(`Canal ${chId} no encontrado`);
      }
    }

    await this.prisma.$transaction([
      this.prisma.publicationChannel.deleteMany({ where: { publicationId } }),
      ...channelIds.map((communicationChannelId) =>
        this.prisma.publicationChannel.create({
          data: { publicationId, communicationChannelId },
        }),
      ),
    ]);

    return this.getPublicationChannels(publicationId);
  }

  async updateDistribution(id: string, dto: UpdateDistributionDto) {
    const record = await this.prisma.publicationChannel.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Registro de distribución no encontrado');
    }

    const data: any = {};
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.preparedText !== undefined) data.preparedText = dto.preparedText;
    if (dto.status === 'MANUALLY_SHARED') data.sharedAt = new Date();
    if (dto.status === 'PREPARED') data.preparedAt = new Date();

    return this.prisma.publicationChannel.update({
      where: { id },
      data,
      include: { communicationChannel: true },
    });
  }

  async analyzeContentMedia(publicationId: string): Promise<{
    contentShape: ContentShape;
    eligiblePlatforms: PlatformEligibility[];
    mediaUrls: MediaUrlInfo[];
  }> {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
      include: {
        content: {
          include: {
            contentMediaResources: {
              include: { mediaResource: true },
            },
          },
        },
      },
    });

    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return this.analyzeContent(publication.contentId);
  }

  async analyzeContentMediaByContentId(contentId: string): Promise<{
    contentShape: ContentShape;
    eligiblePlatforms: PlatformEligibility[];
    mediaUrls: MediaUrlInfo[];
  }> {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: {
        contentMediaResources: {
          include: { mediaResource: true },
        },
      },
    });

    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    return this.analyzeContent(contentId);
  }

  private async analyzeContent(contentId: string): Promise<{
    contentShape: ContentShape;
    eligiblePlatforms: PlatformEligibility[];
    mediaUrls: MediaUrlInfo[];
  }> {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: {
        contentMediaResources: {
          include: { mediaResource: true },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    const mediaResources = content?.contentMediaResources ?? [];
    const mediaUrls: MediaUrlInfo[] = mediaResources.map((cmr) => ({
      url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/uploads/${cmr.mediaResource.resourceUri}`,
      mimeType: cmr.mediaResource.mimeType ?? undefined,
    }));

    const result = this.contentAnalyzer.classifyMedia(mediaUrls.map((m) => m.url));

    return {
      contentShape: result.profile,
      eligiblePlatforms: result.eligiblePlatforms,
      mediaUrls,
    };
  }

  async getEligibleChannels(publicationId: string) {
    const analysis = await this.analyzeContentMedia(publicationId);
    return this.mapChannelsEligibility(analysis.eligiblePlatforms);
  }

  async getEligibleChannelsForContent(contentId: string) {
    const analysis = await this.analyzeContentMediaByContentId(contentId);
    return this.mapChannelsEligibility(analysis.eligiblePlatforms);
  }

  private async mapChannelsEligibility(eligiblePlatforms: PlatformEligibility[]) {
    const allChannels = await this.findAllChannels();

    return allChannels.map((channel) => {
      const eligibility = eligiblePlatforms.find(
        (ep: PlatformEligibility) => ep.platform === channel.type,
      );
      return {
        ...channel,
        eligible: eligibility?.allowed ?? true,
        restrictionReason: eligibility?.reason ?? null,
      };
    });
  }

  async getChannelTokenStatus(platform: string) {
    const credentialsExist = await this.credentialService.hasCredentials(platform, ['page_token', 'page_id']);
    if (!credentialsExist) {
      return {
        platform,
        configured: false,
        valid: false,
        message: 'No hay credenciales configuradas',
      };
    }

    try {
      await this.performConnectionCheck(platform);
      return {
        platform,
        configured: true,
        valid: true,
        message: 'Token válido y conexión activa',
      };
    } catch (err) {
      const msg = (err as any)?.response?.message ?? (err as Error).message;
      const isExpiredToken =
        msg.includes('caducado') || msg.includes('expired') || msg.includes('190');
      return {
        platform,
        configured: true,
        valid: false,
        expired: isExpiredToken,
        message: isExpiredToken
          ? 'Token caducado. Debes reautenticar la aplicación.'
          : `Error de conexión: ${msg}`,
      };
    }
  }

  private async performConnectionCheck(platform: string): Promise<void> {
    switch (platform) {
      case 'FACEBOOK': {
        const { FacebookApiService } = await import('./social-credentials/facebook-api.client');
        const fbService = new FacebookApiService(this.credentialService);
        await fbService.validateConnection();
        break;
      }
      case 'INSTAGRAM': {
        const { InstagramApiService } = await import('./social-credentials/instagram-api.client');
        const igService = new InstagramApiService(this.credentialService);
        await igService.validateConnection();
        break;
      }
      case 'YOUTUBE': {
        const { YouTubeApiService } = await import('./social-credentials/youtube-api.client');
        const ytService = new YouTubeApiService(this.credentialService);
        await ytService.validateConnection();
        break;
      }
      default:
        break;
    }
  }

  async publishToChannel(publicationChannelId: string, userId?: string) {
    const record = await this.prisma.publicationChannel.findUnique({
      where: { id: publicationChannelId },
      include: {
        communicationChannel: true,
        publication: {
          include: {
            content: {
              include: {
                contentMediaResources: {
                  include: { mediaResource: true },
                },
              },
            },
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Registro de distribución no encontrado');
    }

    const adapter = this.publisherFactory.getAdapter(record.communicationChannel.type);
    if (!adapter) {
      throw new BadRequestException(
        `No hay adaptador disponible para el canal ${record.communicationChannel.type}`,
      );
    }

    const content = record.publication.content;
    const mediaUrls: MediaUrlInfo[] = (content?.contentMediaResources ?? []).map((cmr) => ({
      url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/uploads/${cmr.mediaResource.resourceUri}`,
      mimeType: cmr.mediaResource.mimeType ?? undefined,
      filePath: cmr.mediaResource.resourceUri
        ? this.resolveLocalPath(cmr.mediaResource.resourceUri)
        : undefined,
    }));

    const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/publications/${content.slug}`;

    this.logger.log(`Publicando en ${record.communicationChannel.type}: "${content.title}"`);

    const result = await adapter.publish({
      title: record.publication.publicTitle || content.title,
      summary: content.summary || undefined,
      body: content.body || undefined,
      publicUrl,
      publicSlug: record.publication.publicSlug,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      institutionalResponsibility: record.publication.institutionalResponsibility ?? undefined,
      temporalImageUrl: record.publication.temporalImageUrl ?? undefined,
    });

    // Solo marcar como distribuido si la publicación fue exitosa en la red.
    if (result.success) {
      await this.prisma.publicationChannel.update({
        where: { id: publicationChannelId },
        data: {
          status: 'MANUALLY_SHARED',
          sharedAt: new Date(),
        },
      });
    }

    if (userId) {
      await this.traceability.record({
        action: 'DISTRIBUTED',
        userId,
        contentId: record.publication.contentId,
        publicationId: record.publicationId,
        summary: result.success
          ? `Contenido distribuido al canal ${record.communicationChannel.name} (${record.communicationChannel.type}). External ID: ${result.externalPostId ?? 'N/A'}`
          : `FALLÓ publicación al canal ${record.communicationChannel.name} (${record.communicationChannel.type}): ${result.errorMessage}`,
      });
    }

    return {
      channelType: record.communicationChannel.type,
      channelName: record.communicationChannel.name,
      result,
    };
  }

  /**
   * Publica en varios canales de una publicación.
   * Regresa un resumen por canal y un flag `allSucceeded`.
   * Un canal NO se marca como distribuido si falla.
   */
  async publishToChannels(publicationId: string, channelIds: string[], userId?: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
      include: {
        publicationChannels: { include: { communicationChannel: true } },
      },
    });

    if (!publication || publication.deletedAt) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const targets = publication.publicationChannels.filter((pc) =>
      channelIds.includes(pc.communicationChannelId),
    );

    if (targets.length === 0) {
      throw new BadRequestException(
        'No hay canales asociados a la publicación para distribuir',
      );
    }

    const results: Array<{
      channelId: string;
      channelName: string;
      channelType: string;
      success: boolean;
      externalPostId?: string;
      externalPostUrl?: string;
      errorMessage?: string;
    }> = [];

    for (const target of targets) {
      const single = await this.publishToChannel(target.id, userId);
      const result = single.result;
      results.push({
        channelId: target.communicationChannelId,
        channelName: target.communicationChannel.name,
        channelType: target.communicationChannel.type,
        success: result.success,
        externalPostId: result.externalPostId,
        externalPostUrl: result.externalPostUrl,
        errorMessage: result.errorMessage,
      });
    }

    const allSucceeded = results.every((r) => r.success);

    return {
      allSucceeded,
      results,
    };
  }

  /**
   * Orquesta la publicación completa:
   * 1) Crea la publicación en modo invisible (isVisible=false).
   * 2) Asocia los canales seleccionados.
   * 3) Publica en las redes sociales.
   * 4) SOLO si TODAS las redes respondieron con éxito, marca la publicación como visible.
   *    De lo contrario la publicación queda invisible y NO aparece en el sitio público.
   */
  async publishContentToSocials(contentId: string, dto: PublishToSocialsDto, userId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: { publication: true, publicationReview: true },
    });

    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }
    // Si existe una publicación previa invisible (fallo en redes), se limpia para permitir reintento.
    if (content.publication && !content.publication.isVisible) {
      await this.prisma.publicationChannel.deleteMany({
        where: { publicationId: content.publication.id },
      });
      await this.prisma.publication.delete({ where: { id: content.publication.id } });
    }
    if (content.publication && content.publication.isVisible) {
      throw new BadRequestException('Este contenido ya tiene una publicación visible');
    }
    if (content.status !== 'READY_FOR_PUBLICATION') {
      throw new BadRequestException(
        'El contenido debe estar en estado READY_FOR_PUBLICATION para publicarse',
      );
    }
    if (
      !content.publicationReview ||
      !content.publicationReview.isCurrent ||
      content.publicationReview.decision !== 'APPROVED'
    ) {
      throw new BadRequestException(
        'El contenido debe tener una revisión editorial aprobada y vigente para publicarse',
      );
    }
    if (!dto.institutionalResponsibility || dto.institutionalResponsibility.trim().length < 10) {
      throw new BadRequestException(
        'Debe especificar la responsabilidad institucional que respalda la publicación',
      );
    }

    const baseSlug = dto.publicSlug || this.slugify(dto.publicTitle || content.title);
    const publicSlug = await this.resolveUniqueSlug(baseSlug);

    // 1) Publicación invisible (no aparece en el sitio hasta confirmar redes)
    const publication = await this.prisma.publication.create({
      data: {
        contentId,
        publicSlug,
        publicTitle: dto.publicTitle || content.title,
        status: PublicationStatus.PUBLISHED,
        institutionalResponsibility: dto.institutionalResponsibility,
        temporalImageUrl: dto.urlImagenTemporal ?? null,
        isVisible: false,
      },
    });

    // 2) Asociar canales
    const channelIds = dto.channelIds || [];
    if (channelIds.length > 0) {
      for (const chId of channelIds) {
        const channel = await this.prisma.communicationChannel.findUnique({ where: { id: chId } });
        if (!channel || channel.deletedAt) {
          throw new NotFoundException(`Canal ${chId} no encontrado`);
        }
      }
      await this.prisma.$transaction([
        this.prisma.publicationChannel.deleteMany({ where: { publicationId: publication.id } }),
        ...channelIds.map((communicationChannelId) =>
          this.prisma.publicationChannel.create({
            data: { publicationId: publication.id, communicationChannelId },
          }),
        ),
      ]);
    }

    // 3) Publicar en redes
    const distribution = await this.publishToChannels(publication.id, channelIds, userId);

    // 4) Solo si TODAS las redes funcionaron, hacer visible la publicación
    if (distribution.allSucceeded) {
      await this.prisma.publication.update({
        where: { id: publication.id },
        data: { isVisible: true, publishedAt: new Date() },
      });
      await this.traceability.record({
        action: 'PUBLISHED',
        userId,
        contentId,
        publicationId: publication.id,
        summary: `Publicación "${publication.publicTitle}" publicada y distribuida a ${channelIds.length} red(es)`,
      });
    }

    return {
      allSucceeded: distribution.allSucceeded,
      publicationVisible: distribution.allSucceeded,
      results: distribution.results,
      fallbackMessage: distribution.allSucceeded
        ? undefined
        : 'El contenido se guardó localmente, pero falló la publicación en la(s) red(es).',
      publication: {
        id: publication.id,
        publicSlug: publication.publicSlug,
        publicTitle: publication.publicTitle,
        isVisible: distribution.allSucceeded,
      },
    };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
  }

  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug || 'publicacion';
    let counter = 0;
    while (true) {
      const candidate = counter === 0 ? slug : `${slug}-${counter}`;
      const existing = await this.prisma.publication.findUnique({
        where: { publicSlug: candidate },
        select: { id: true },
      });
      if (!existing) return candidate;
      counter++;
    }
  }

  private resolveLocalPath(resourceUri: string): string | undefined {
    const candidates = [
      process.env.UPLOAD_DIR,
      join(process.cwd(), 'uploads'),
      join(process.cwd(), 'apps', 'api', 'uploads'),
      join(process.cwd(), '..', 'uploads'),
    ].filter((p): p is string => !!p);

    for (const base of candidates) {
      const candidate = join(base, resourceUri);
      if (existsSync(candidate)) return candidate;
    }
    return undefined;
  }
}

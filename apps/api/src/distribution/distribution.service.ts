import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, UpdateDistributionDto } from './dto';
import { SocialPublisherFactory } from './adapters/publisher-factory';

@Injectable()
export class DistributionService {
  private readonly logger = new Logger(DistributionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly publisherFactory: SocialPublisherFactory,
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

  async publishToChannel(publicationChannelId: string) {
    const record = await this.prisma.publicationChannel.findUnique({
      where: { id: publicationChannelId },
      include: {
        communicationChannel: true,
        publication: {
          include: {
            content: {
              select: {
                title: true,
                summary: true,
                body: true,
                slug: true,
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

    const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/publications/${record.publication.content.slug}`;

    this.logger.log(`Publicando en ${record.communicationChannel.type}: "${record.publication.content.title}"`);

    const result = await adapter.publish({
      title: record.publication.publicTitle || record.publication.content.title,
      summary: record.publication.content.summary || undefined,
      body: record.publication.content.body || undefined,
      publicUrl,
    });

    await this.prisma.publicationChannel.update({
      where: { id: publicationChannelId },
      data: {
        status: 'MANUALLY_SHARED',
        sharedAt: new Date(),
      },
    });

    return {
      channelType: record.communicationChannel.type,
      channelName: record.communicationChannel.name,
      result,
    };
  }
}

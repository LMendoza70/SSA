import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageProvider } from './storage-provider.interface';
import {
  CreateMediaResourceDto,
  UpdateMediaResourceDto,
  MediaResourceListQueryDto,
  AssociateMediaDto,
} from './dto';
import { MediaResourceType } from '../generated/prisma/client';

const ALLOWED_MIME_TYPES: Record<string, MediaResourceType[]> = {
  'image/jpeg': [MediaResourceType.IMAGE, MediaResourceType.INFOGRAPHIC],
  'image/png': [MediaResourceType.IMAGE, MediaResourceType.INFOGRAPHIC],
  'image/webp': [MediaResourceType.IMAGE, MediaResourceType.INFOGRAPHIC],
  'image/gif': [MediaResourceType.IMAGE],
  'image/svg+xml': [MediaResourceType.INFOGRAPHIC],
  'application/pdf': [MediaResourceType.PDF],
  'application/msword': [MediaResourceType.DOCUMENT],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [MediaResourceType.DOCUMENT],
  'video/mp4': [MediaResourceType.VIDEO_LINK],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('STORAGE_PROVIDER') private readonly storage: StorageProvider,
  ) {}

  async upload(file: Express.Multer.File, dto: CreateMediaResourceDto) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('El archivo excede el tamaño máximo de 10MB');
    }

    const allowedTypes = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedTypes) {
      throw new BadRequestException(`Tipo de archivo no soportado: ${file.mimetype}`);
    }

    if (!allowedTypes.includes(dto.type)) {
      throw new BadRequestException(
        `El tipo ${dto.type} no es compatible con archivos ${file.mimetype}`,
      );
    }

    const folder = dto.type.toLowerCase();
    const resourceUri = await this.storage.save(file, folder);
    const url = this.storage.getUrl(resourceUri);

    const resource = await this.prisma.mediaResource.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        resourceUri,
        mimeType: file.mimetype,
        altText: dto.altText,
      },
    });

    return this.toResponse(resource, url);
  }

  async createExternal(dto: CreateMediaResourceDto) {
    const resource = await this.prisma.mediaResource.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        altText: dto.altText,
      },
    });

    return this.toResponse(resource);
  }

  async findAll(query: MediaResourceListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (query.type) {
      where.type = query.type;
    }

    const [items, total] = await Promise.all([
      this.prisma.mediaResource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mediaResource.count({ where }),
    ]);

    return {
      data: items.map((item) => this.toResponse(item, this.storage.getUrl(item.resourceUri!))),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const resource = await this.prisma.mediaResource.findUnique({ where: { id } });
    if (!resource || resource.deletedAt) {
      throw new NotFoundException('Recurso no encontrado');
    }
    return this.toResponse(resource, this.storage.getUrl(resource.resourceUri!));
  }

  async update(id: string, dto: UpdateMediaResourceDto) {
    const existing = await this.prisma.mediaResource.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Recurso no encontrado');
    }

    const data: any = {};
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.altText !== undefined) data.altText = dto.altText;

    const resource = await this.prisma.mediaResource.update({ where: { id }, data });
    return this.toResponse(resource, this.storage.getUrl(resource.resourceUri!));
  }

  async remove(id: string) {
    const existing = await this.prisma.mediaResource.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Recurso no encontrado');
    }

    await this.prisma.mediaResource.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    if (existing.resourceUri) {
      await this.storage.delete(existing.resourceUri);
    }
  }

  async getContentMedia(contentId: string) {
    const associations = await this.prisma.contentMediaResource.findMany({
      where: { contentId },
      include: { mediaResource: true },
      orderBy: { sortOrder: 'asc' },
    });

    return associations.map((a) => ({
      ...this.toResponse(a.mediaResource, this.storage.getUrl(a.mediaResource.resourceUri!)),
      caption: a.caption,
      sortOrder: a.sortOrder,
    }));
  }

  async associateContent(contentId: string, dto: AssociateMediaDto) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    for (const mediaResourceId of dto.mediaResourceIds) {
      const resource = await this.prisma.mediaResource.findUnique({ where: { id: mediaResourceId } });
      if (!resource || resource.deletedAt) {
        throw new NotFoundException(`Recurso ${mediaResourceId} no encontrado`);
      }
    }

    const data = dto.mediaResourceIds.map((mediaResourceId, i) => ({
      contentId,
      mediaResourceId,
      sortOrder: i,
    }));

    await this.prisma.$transaction([
      this.prisma.contentMediaResource.deleteMany({ where: { contentId } }),
      this.prisma.contentMediaResource.createMany({ data }),
    ]);
  }

  async removeAssociation(contentId: string, mediaResourceId: string) {
    const association = await this.prisma.contentMediaResource.findUnique({
      where: { contentId_mediaResourceId: { contentId, mediaResourceId } },
    });

    if (!association) {
      throw new NotFoundException('Asociación no encontrada');
    }

    await this.prisma.contentMediaResource.delete({
      where: { contentId_mediaResourceId: { contentId, mediaResourceId } },
    });
  }

  private toResponse(resource: any, url?: string) {
    return {
      id: resource.id,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      resourceUri: resource.resourceUri,
      url: url || resource.externalUrl,
      mimeType: resource.mimeType,
      altText: resource.altText,
      isActive: resource.isActive,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    };
  }
}

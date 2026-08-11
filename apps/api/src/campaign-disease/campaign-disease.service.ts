import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto, CreateDiseaseDto, UpdateDiseaseDto } from './dto';
import sanitizeHtml from 'sanitize-html';

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption', 'span']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height', 'style'],
    '*': ['style', 'class'],
  },
};

function slugify(text: string): string {
  return text
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

@Injectable()
export class CampaignDiseaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCampaign(dto: CreateCampaignDto) {
    const slug = slugify(dto.title);
    const campaign = await this.prisma.campaign.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ? sanitizeHtml(dto.description, SANITIZE_CONFIG) : undefined,
        objective: dto.objective ? sanitizeHtml(dto.objective, SANITIZE_CONFIG) : undefined,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });
    return campaign;
  }

  async findAllCampaigns() {
    return this.prisma.campaign.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCampaignById(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }
    return campaign;
  }

  async updateCampaign(id: string, dto: UpdateCampaignDto) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }

    const data: any = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
      data.slug = slugify(dto.title);
    }
    if (dto.description !== undefined) data.description = sanitizeHtml(dto.description, SANITIZE_CONFIG);
    if (dto.objective !== undefined) data.objective = sanitizeHtml(dto.objective, SANITIZE_CONFIG);
    if (dto.startsAt !== undefined) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt !== undefined) data.endsAt = new Date(dto.endsAt);
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.campaign.update({ where: { id }, data });
  }

  async removeCampaign(id: string) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }
    await this.prisma.campaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createDisease(dto: CreateDiseaseDto) {
    const slug = slugify(dto.name);
    const disease = await this.prisma.disease.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description ? sanitizeHtml(dto.description, SANITIZE_CONFIG) : undefined,
      },
    });
    return disease;
  }

  async findAllDiseases() {
    return this.prisma.disease.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findDiseaseById(id: string) {
    const disease = await this.prisma.disease.findUnique({ where: { id } });
    if (!disease || disease.deletedAt) {
      throw new NotFoundException('Enfermedad no encontrada');
    }
    return disease;
  }

  async updateDisease(id: string, dto: UpdateDiseaseDto) {
    const existing = await this.prisma.disease.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Enfermedad no encontrada');
    }

    const data: any = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = slugify(dto.name);
    }
    if (dto.description !== undefined) data.description = sanitizeHtml(dto.description, SANITIZE_CONFIG);
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.disease.update({ where: { id }, data });
  }

  async removeDisease(id: string) {
    const existing = await this.prisma.disease.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Enfermedad no encontrada');
    }
    await this.prisma.disease.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async associateCampaigns(contentId: string, campaignIds: string[]) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    for (const cId of campaignIds) {
      const campaign = await this.prisma.campaign.findUnique({ where: { id: cId } });
      if (!campaign || campaign.deletedAt) {
        throw new NotFoundException(`Campaña ${cId} no encontrada`);
      }
    }

    await this.prisma.$transaction([
      this.prisma.contentCampaign.deleteMany({ where: { contentId } }),
      ...campaignIds.map((campaignId) =>
        this.prisma.contentCampaign.create({ data: { contentId, campaignId } }),
      ),
    ]);
  }

  async getContentCampaigns(contentId: string) {
    const items = await this.prisma.contentCampaign.findMany({
      where: { contentId },
      include: { campaign: true },
    });
    return items.map((i) => i.campaign);
  }

  async associateDiseases(contentId: string, diseaseIds: string[]) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) {
      throw new NotFoundException('Contenido no encontrado');
    }

    for (const dId of diseaseIds) {
      const disease = await this.prisma.disease.findUnique({ where: { id: dId } });
      if (!disease || disease.deletedAt) {
        throw new NotFoundException(`Enfermedad ${dId} no encontrada`);
      }
    }

    await this.prisma.$transaction([
      this.prisma.contentDisease.deleteMany({ where: { contentId } }),
      ...diseaseIds.map((diseaseId) =>
        this.prisma.contentDisease.create({ data: { contentId, diseaseId } }),
      ),
    ]);
  }

  async getContentDiseases(contentId: string) {
    const items = await this.prisma.contentDisease.findMany({
      where: { contentId },
      include: { disease: true },
    });
    return items.map((i) => i.disease);
  }

  async associateCampaignDiseases(campaignId: string, diseaseIds: string[]) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.deletedAt) {
      throw new NotFoundException('Campaña no encontrada');
    }

    await this.prisma.$transaction([
      this.prisma.campaignDisease.deleteMany({ where: { campaignId } }),
      ...diseaseIds.map((diseaseId) =>
        this.prisma.campaignDisease.create({ data: { campaignId, diseaseId } }),
      ),
    ]);
  }

  async getCampaignDiseases(campaignId: string) {
    const items = await this.prisma.campaignDisease.findMany({
      where: { campaignId },
      include: { disease: true },
    });
    return items.map((i) => i.disease);
  }
}

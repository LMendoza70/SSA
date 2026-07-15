import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateTagDto,
  UpdateTagDto,
  CreateContentTypeDto,
  UpdateContentTypeDto,
} from './dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

@Injectable()
export class ClassificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const slug = slugify(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    return this.prisma.category.create({ data: { name: dto.name, slug, description: dto.description } });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat || cat.deletedAt) throw new NotFoundException('Categoría no encontrada');
    return cat;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findCategoryById(id);
    const data: any = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = slugify(dto.name);
      const slugConflict = await this.prisma.category.findUnique({ where: { slug: data.slug } });
      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictException('Ya existe otra categoría con ese nombre');
      }
    }
    if (dto.description !== undefined) data.description = dto.description;
    return this.prisma.category.update({ where: { id }, data });
  }

  async removeCategory(id: string) {
    await this.findCategoryById(id);
    await this.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async createTag(dto: CreateTagDto) {
    const slug = slugify(dto.name);
    const existing = await this.prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe una etiqueta con ese nombre');
    }
    return this.prisma.tag.create({ data: { name: dto.name, slug, description: dto.description } });
  }

  async findAllTags() {
    return this.prisma.tag.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findTagById(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag || tag.deletedAt) throw new NotFoundException('Etiqueta no encontrada');
    return tag;
  }

  async updateTag(id: string, dto: UpdateTagDto) {
    await this.findTagById(id);
    const data: any = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = slugify(dto.name);
      const slugConflict = await this.prisma.tag.findUnique({ where: { slug: data.slug } });
      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictException('Ya existe otra etiqueta con ese nombre');
      }
    }
    if (dto.description !== undefined) data.description = dto.description;
    return this.prisma.tag.update({ where: { id }, data });
  }

  async removeTag(id: string) {
    await this.findTagById(id);
    await this.prisma.tag.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async createContentType(dto: CreateContentTypeDto) {
    const existing = await this.prisma.contentType.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException('Ya existe un tipo de contenido con ese código');
    }
    return this.prisma.contentType.create({ data: dto });
  }

  async findAllContentTypes() {
    return this.prisma.contentType.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async updateContentType(id: string, dto: UpdateContentTypeDto) {
    const existing = await this.prisma.contentType.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Tipo de contenido no encontrado');
    const data: any = {};
    if (dto.code !== undefined) {
      const codeConflict = await this.prisma.contentType.findUnique({ where: { code: dto.code } });
      if (codeConflict && codeConflict.id !== id) {
        throw new ConflictException('Ya existe otro tipo con ese código');
      }
      data.code = dto.code;
    }
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    return this.prisma.contentType.update({ where: { id }, data });
  }

  async removeContentType(id: string) {
    const existing = await this.prisma.contentType.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Tipo de contenido no encontrado');
    await this.prisma.contentType.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  async associateCategories(contentId: string, categoryIds: string[]) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    for (const catId of categoryIds) {
      const cat = await this.prisma.category.findUnique({ where: { id: catId } });
      if (!cat || cat.deletedAt) throw new NotFoundException(`Categoría ${catId} no encontrada`);
    }

    await this.prisma.$transaction([
      this.prisma.contentCategory.deleteMany({ where: { contentId } }),
      ...categoryIds.map((categoryId) =>
        this.prisma.contentCategory.create({ data: { contentId, categoryId } }),
      ),
    ]);
  }

  async associateTags(contentId: string, tagIds: string[]) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || content.deletedAt) throw new NotFoundException('Contenido no encontrado');

    for (const tagId of tagIds) {
      const tag = await this.prisma.tag.findUnique({ where: { id: tagId } });
      if (!tag || tag.deletedAt) throw new NotFoundException(`Etiqueta ${tagId} no encontrada`);
    }

    await this.prisma.$transaction([
      this.prisma.contentTag.deleteMany({ where: { contentId } }),
      ...tagIds.map((tagId) =>
        this.prisma.contentTag.create({ data: { contentId, tagId } }),
      ),
    ]);
  }

  async getContentCategories(contentId: string) {
    const items = await this.prisma.contentCategory.findMany({
      where: { contentId },
      include: { category: true },
    });
    return items.map((i) => i.category);
  }

  async getContentTags(contentId: string) {
    const items = await this.prisma.contentTag.findMany({
      where: { contentId },
      include: { tag: true },
    });
    return items.map((i) => i.tag);
  }
}

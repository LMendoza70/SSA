import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClassificationService } from './classification.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateTagDto,
  UpdateTagDto,
  CreateContentTypeDto,
  UpdateContentTypeDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Classification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class ClassificationController {
  constructor(private readonly service: ClassificationService) {}

  @Post('categories')
  @ApiOperation({ summary: 'Crear categoría' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorías' })
  async findAllCategories() {
    return this.service.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Obtener categoría' })
  async findCategoryById(@Param('id') id: string) {
    return this.service.findCategoryById(id);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Eliminar categoría' })
  async removeCategory(@Param('id') id: string) {
    await this.service.removeCategory(id);
    return { message: 'Categoría eliminada' };
  }

  @Post('tags')
  @ApiOperation({ summary: 'Crear etiqueta' })
  async createTag(@Body() dto: CreateTagDto) {
    return this.service.createTag(dto);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Listar etiquetas' })
  async findAllTags() {
    return this.service.findAllTags();
  }

  @Get('tags/:id')
  @ApiOperation({ summary: 'Obtener etiqueta' })
  async findTagById(@Param('id') id: string) {
    return this.service.findTagById(id);
  }

  @Patch('tags/:id')
  @ApiOperation({ summary: 'Actualizar etiqueta' })
  async updateTag(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.service.updateTag(id, dto);
  }

  @Delete('tags/:id')
  @ApiOperation({ summary: 'Eliminar etiqueta' })
  async removeTag(@Param('id') id: string) {
    await this.service.removeTag(id);
    return { message: 'Etiqueta eliminada' };
  }

  @Post('content-types')
  @ApiOperation({ summary: 'Crear tipo de contenido' })
  async createContentType(@Body() dto: CreateContentTypeDto) {
    return this.service.createContentType(dto);
  }

  @Patch('content-types/:id')
  @ApiOperation({ summary: 'Actualizar tipo de contenido' })
  async updateContentType(@Param('id') id: string, @Body() dto: UpdateContentTypeDto) {
    return this.service.updateContentType(id, dto);
  }

  @Delete('content-types/:id')
  @ApiOperation({ summary: 'Eliminar tipo de contenido' })
  async removeContentType(@Param('id') id: string) {
    await this.service.removeContentType(id);
    return { message: 'Tipo de contenido eliminado' };
  }

  @Post('contents/:contentId/categories')
  @ApiOperation({ summary: 'Asociar categorías a contenido' })
  async associateCategories(@Param('contentId') contentId: string, @Body('categoryIds') categoryIds: string[]) {
    await this.service.associateCategories(contentId, categoryIds || []);
    return { message: 'Categorías asociadas' };
  }

  @Get('contents/:contentId/categories')
  @ApiOperation({ summary: 'Obtener categorías de un contenido' })
  async getContentCategories(@Param('contentId') contentId: string) {
    return this.service.getContentCategories(contentId);
  }

  @Post('contents/:contentId/tags')
  @ApiOperation({ summary: 'Asociar etiquetas a contenido' })
  async associateTags(@Param('contentId') contentId: string, @Body('tagIds') tagIds: string[]) {
    await this.service.associateTags(contentId, tagIds || []);
    return { message: 'Etiquetas asociadas' };
  }

  @Get('contents/:contentId/tags')
  @ApiOperation({ summary: 'Obtener etiquetas de un contenido' })
  async getContentTags(@Param('contentId') contentId: string) {
    return this.service.getContentTags(contentId);
  }
}

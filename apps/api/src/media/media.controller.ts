import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MediaService } from './media.service';
import {
  CreateMediaResourceDto,
  UpdateMediaResourceDto,
  MediaResourceListQueryDto,
  MediaResourceResponseDto,
  AssociateMediaDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin / Media Resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/media-resources')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir archivo multimedia' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMediaResourceDto,
  ) {
    return this.mediaService.upload(file, dto);
  }

  @Post('external')
  @ApiOperation({ summary: 'Crear recurso externo (sin archivo)' })
  async createExternal(@Body() dto: CreateMediaResourceDto) {
    return this.mediaService.createExternal(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar recursos multimedia' })
  async findAll(@Query() query: MediaResourceListQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener recurso por ID' })
  async findById(@Param('id') id: string): Promise<MediaResourceResponseDto> {
    return this.mediaService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar metadatos del recurso' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaResourceDto,
  ): Promise<MediaResourceResponseDto> {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar recurso (soft delete)' })
  async remove(@Param('id') id: string) {
    await this.mediaService.remove(id);
    return { message: 'Recurso eliminado' };
  }

  @Get('by-content/:contentId')
  @ApiOperation({ summary: 'Obtener recursos asociados a un contenido' })
  async getContentMedia(@Param('contentId') contentId: string) {
    return this.mediaService.getContentMedia(contentId);
  }

  @Put('associate/:contentId')
  @ApiOperation({ summary: 'Asociar recursos a un contenido' })
  async associateContent(
    @Param('contentId') contentId: string,
    @Body() dto: AssociateMediaDto,
  ) {
    await this.mediaService.associateContent(contentId, dto);
    return { message: 'Recursos asociados' };
  }

  @Delete('associate/:contentId/:mediaResourceId')
  @ApiOperation({ summary: 'Desasociar recurso de contenido' })
  async removeAssociation(
    @Param('contentId') contentId: string,
    @Param('mediaResourceId') mediaResourceId: string,
  ) {
    await this.mediaService.removeAssociation(contentId, mediaResourceId);
    return { message: 'Asociación eliminada' };
  }
}

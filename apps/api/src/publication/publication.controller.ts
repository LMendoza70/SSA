import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PublicationService } from './publication.service';
import { CreatePublicationDto, PublicationListQueryDto, PublicationResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@ApiTags('Admin / Publications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR', 'PUBLISHER')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post('contents/:contentId/publication')
  @ApiOperation({ summary: 'Crear publicación desde un Content elegible' })
  async create(
    @Param('contentId') contentId: string,
    @Body() dto: CreatePublicationDto,
    @Req() req: Request,
  ): Promise<PublicationResponseDto> {
    const userId = (req as any).user.id;
    return this.publicationService.create(contentId, dto, userId);
  }

  @Get('publications')
  @ApiOperation({ summary: 'Listar publicaciones administrativas' })
  async findAll(@Query() query: PublicationListQueryDto) {
    return this.publicationService.findAll(query);
  }

  @Get('publications/:id')
  @ApiOperation({ summary: 'Consultar publicación por ID' })
  async findById(@Param('id') id: string): Promise<PublicationResponseDto> {
    return this.publicationService.findById(id);
  }

  @Post('publications/:id/withdrawal')
  @ApiOperation({ summary: 'Retirar publicación activa' })
  async withdraw(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<PublicationResponseDto> {
    const userId = (req as any).user.id;
    return this.publicationService.withdraw(id, userId);
  }

  @Post('publications/:id/republish')
  @ApiOperation({ summary: 'Republicar una publicación retirada o archivada' })
  async republish(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<PublicationResponseDto> {
    const userId = (req as any).user.id;
    return this.publicationService.republish(id, userId);
  }

  @Post('publications/:id/archive')
  @ApiOperation({ summary: 'Archivar publicación' })
  async archive(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<PublicationResponseDto> {
    const userId = (req as any).user.id;
    return this.publicationService.archive(id, userId);
  }
}

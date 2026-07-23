import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin / Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => ({ id: u.id, email: u.email, displayName: u.displayName, role: u.role, isActive: u.isActive, createdAt: u.createdAt }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar usuario por ID' })
  async findById(@Param('id') id: string) {
    const u = await this.usersService.findById(id);
    return { id: u.id, email: u.email, displayName: u.displayName, role: u.role, isActive: u.isActive, createdAt: u.createdAt };
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  async create(@Body() dto: CreateUserDto) {
    const u = await this.usersService.create(dto);
    return { id: u.id, email: u.email, displayName: u.displayName, role: u.role, isActive: u.isActive, createdAt: u.createdAt };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const u = await this.usersService.update(id, dto);
    return { id: u.id, email: u.email, displayName: u.displayName, role: u.role, isActive: u.isActive, createdAt: u.createdAt };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un usuario (soft delete)' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Usuario desactivado' };
  }
}

import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { IUserRepository, StoredUser } from './interfaces/user-repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<StoredUser[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<StoredUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto): Promise<StoredUser> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }
    const passwordHash = await hash(dto.password);
    return this.userRepository.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
      role: dto.role as StoredUser['role'],
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<StoredUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) throw new ConflictException('El email ya está en uso');
    }

    const data: Partial<Omit<StoredUser, 'id' | 'createdAt'>> = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.displayName !== undefined) data.displayName = dto.displayName;
    if (dto.role !== undefined) data.role = dto.role as StoredUser['role'];
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password !== undefined) {
      data.passwordHash = await hash(dto.password);
    }

    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');
    await this.userRepository.update(id, { isActive: false });
  }
}

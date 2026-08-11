import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IUserRepository, StoredUser } from "../interfaces/user-repository.interface";

type PrismaUser = {
  id: string; email: string; displayName: string; passwordHash: string; role: string; isActive: boolean; createdAt: Date;
};

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    }) as unknown as PrismaUser | null;
    if (!user) return null;
    return this.toStoredUser(user);
  }

  async findById(id: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    }) as unknown as PrismaUser | null;
    if (!user) return null;
    return this.toStoredUser(user);
  }

  async findAll(): Promise<StoredUser[]> {
    const users = await this.prisma.user.findMany({ where: { isActive: true } }) as unknown as PrismaUser[];
    return users.map((u) => this.toStoredUser(u));
  }

  async create(data: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
    }) as unknown as PrismaUser;
    return this.toStoredUser(user);
  }

  async update(id: string, data: Partial<Omit<StoredUser, 'id' | 'createdAt'>>): Promise<StoredUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.displayName !== undefined && { displayName: data.displayName }),
        ...(data.passwordHash !== undefined && { passwordHash: data.passwordHash }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    }) as unknown as PrismaUser;
    return this.toStoredUser(user);
  }

  private toStoredUser(user: PrismaUser): StoredUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      role: user.role as StoredUser['role'],
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}

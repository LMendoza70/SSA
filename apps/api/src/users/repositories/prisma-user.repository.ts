import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IUserRepository, StoredUser } from "../interfaces/user-repository.interface";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });
    if (!user) return null;
    return this.toStoredUser(user);
  }

  async findById(id: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });
    if (!user) return null;
    return this.toStoredUser(user);
  }

  private toStoredUser(
    user: { id: string; email: string; displayName: string; passwordHash: string; isActive: boolean; createdAt: Date }
  ): StoredUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}

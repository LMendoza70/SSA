import { Injectable } from '@nestjs/common';
import { IUserRepository, StoredUser } from '../interfaces/user-repository.interface';

const ADMIN_HASH = '$argon2id$v=19$m=65536,t=3,p=4$RZ65S+cY2pdacgV1lRPp+g$tp4DOUkdQirMhUQSKb0YwzvvYQLSgWqAYaXV4TBB5N0';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: StoredUser[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@jurisdiccion.gob.mx',
      displayName: 'Administrador',
      passwordHash: ADMIN_HASH,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date('2026-01-01'),
    },
  ];

  async findByEmail(email: string): Promise<StoredUser | null> {
    return this.users.find((u) => u.email === email && u.isActive) ?? null;
  }

  async findById(id: string): Promise<StoredUser | null> {
    return this.users.find((u) => u.id === id && u.isActive) ?? null;
  }

  async findAll(): Promise<StoredUser[]> {
    return this.users.filter((u) => u.isActive);
  }

  async create(data: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser> {
    const user: StoredUser = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<Omit<StoredUser, 'id' | 'createdAt'>>): Promise<StoredUser> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }
}

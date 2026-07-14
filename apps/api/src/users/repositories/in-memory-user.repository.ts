import { Injectable } from '@nestjs/common';
import { IUserRepository, StoredUser } from '../interfaces/user-repository.interface';

const ADMIN_HASH = '$argon2id$v=19$m=65536,t=3,p=4$MykeCysah7KClKF0PhNChQ$+dWAsA/Gkc1lpG77GaOp21Xd6X7q96gxH832X1MAewg';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: StoredUser[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@jurisdiccion.gob.mx',
      displayName: 'Administrador',
      passwordHash: ADMIN_HASH,
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
}

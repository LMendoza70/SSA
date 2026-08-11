export type UserRole = 'ADMIN' | 'EDITOR' | 'WRITER' | 'VALIDATOR' | 'PUBLISHER' | 'AUDITOR';

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  findById(id: string): Promise<StoredUser | null>;
  findAll(): Promise<StoredUser[]>;
  create(user: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser>;
  update(id: string, data: Partial<Omit<StoredUser, 'id' | 'createdAt'>>): Promise<StoredUser>;
}

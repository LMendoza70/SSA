export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  findById(id: string): Promise<StoredUser | null>;
}

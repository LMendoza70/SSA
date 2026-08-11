import { SetMetadata } from '@nestjs/common';

export type UserRole = 'ADMIN' | 'EDITOR' | 'WRITER' | 'VALIDATOR' | 'PUBLISHER' | 'AUDITOR';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

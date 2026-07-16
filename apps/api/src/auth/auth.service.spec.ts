import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: { findByEmail: any; findById: any };
  let jwtService: JwtService;

  const testPassword = 'test-password-123';
  let hashedPassword: string;

  const mockUser = {
    id: 'user-1',
    email: 'admin@jurisdiccion.gob.mx',
    displayName: 'Admin',
    passwordHash: '',
    isActive: true,
    createdAt: new Date('2026-01-01'),
  };

  beforeAll(async () => {
    hashedPassword = await hash(testPassword);
    mockUser.passwordHash = hashedPassword;
  });

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
    };

    jwtService = new JwtService({ secret: 'test-secret' });
    vi.spyOn(jwtService, 'sign').mockReturnValue('test-access-token');

    const configService = new ConfigService({ JWT_EXPIRES_IN: '15m' });
    vi.spyOn(configService, 'get').mockReturnValue('15m');

    service = new AuthService(
      userRepository as any,
      jwtService,
      configService,
    );
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@test.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login({ email: mockUser.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return AuthResponseDto on valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      vi.spyOn(jwtService, 'sign').mockReturnValue('access-token-123');

      const result = await service.login({
        email: mockUser.email,
        password: testPassword,
      });

      expect(result).toHaveProperty('accessToken', 'access-token-123');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.refresh('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should generate a new token for valid user', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      vi.spyOn(jwtService, 'sign').mockReturnValue('new-access-token');

      const result = await service.refresh(mockUser.id);

      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });
  });

  describe('getProfile', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user profile for valid user', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });
  });
});

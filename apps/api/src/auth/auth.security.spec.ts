import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('Security: JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: { findByEmail: any; findById: any };

  const mockUser = {
    id: 'user-1',
    email: 'admin@jurisdiccion.gob.mx',
    displayName: 'Admin',
  };

  beforeEach(async () => {
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
    };

    const configService = new ConfigService({ JWT_SECRET: 'test-secret-key-for-testing-only' });

    strategy = new JwtStrategy(configService, userRepository as any);
  });

  describe('validate', () => {
    it('should return user object when user exists', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate({ sub: 'user-1', email: 'admin@jurisdiccion.gob.mx' });

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: 'nonexistent', email: 'test@test.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

describe('Security: JwtService token validation', () => {
  let jwtService: JwtService;

  beforeAll(() => {
    jwtService = new JwtService({ secret: 'test-secret-key-for-testing-only' });
  });

  it('should sign and verify a valid token', () => {
    const payload = { sub: 'user-1', email: 'admin@test.com' };
    const token = jwtService.sign(payload);

    const decoded = jwtService.verify(token);
    expect(decoded).toHaveProperty('sub', 'user-1');
    expect(decoded).toHaveProperty('email', 'admin@test.com');
  });

  it('should reject a token signed with a different secret', () => {
    const token = jwtService.sign({ sub: 'user-1' });
    const differentService = new JwtService({ secret: 'different-secret' });

    expect(() => differentService.verify(token)).toThrow();
  });

  it('should reject an expired token', () => {
    const expiredToken = jwtService.sign({ sub: 'user-1' }, { expiresIn: '0s' });

    expect(() => jwtService.verify(expiredToken)).toThrow();
  });

  it('should reject a malformed token', () => {
    expect(() => jwtService.verify('invalid-token')).toThrow();
  });
});

describe('Security: AuthController - refresh token flow', () => {
  let jwtService: JwtService;
  let refreshSecret: string;

  beforeAll(() => {
    refreshSecret = 'test-refresh-secret';
    jwtService = new JwtService({ secret: 'test-secret-key-for-testing-only' });
  });

  it('should generate a valid refresh token', () => {
    const refreshToken = jwtService.sign(
      { sub: 'user-1' },
      { secret: refreshSecret, expiresIn: '7d' },
    );

    const decoded = jwtService.verify(refreshToken, { secret: refreshSecret });
    expect(decoded).toHaveProperty('sub', 'user-1');
  });

  it('should reject refresh token with wrong secret', () => {
    const refreshToken = jwtService.sign(
      { sub: 'user-1' },
      { secret: refreshSecret, expiresIn: '7d' },
    );

    expect(() =>
      jwtService.verify(refreshToken, { secret: 'wrong-secret' }),
    ).toThrow();
  });

  it('should reject expired refresh token', () => {
    const expiredRefresh = jwtService.sign(
      { sub: 'user-1' },
      { secret: refreshSecret, expiresIn: '0s' },
    );

    expect(() =>
      jwtService.verify(expiredRefresh, { secret: refreshSecret }),
    ).toThrow();
  });
});

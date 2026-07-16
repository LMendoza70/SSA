import { Controller, Post, Get, Body, Req, UseGuards, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenBlacklistService } from './services/token-blacklist.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
    private readonly tokenBlacklist: TokenBlacklistService,
  ) {
    this.refreshSecret = configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.refreshExpiresIn = configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
  }

  private generateRefreshToken(userId: string): { token: string; jti: string } {
    const jti = randomUUID();
    const token = this.jwtService.sign(
      { sub: userId, jti },
      { secret: this.refreshSecret, expiresIn: this.refreshExpiresIn as any },
    );
    return { token, jti };
  }

  private setRefreshCookie(res: any, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión administrativa' })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    const { token } = this.generateRefreshToken(result.user.id);
    if (req.res) {
      this.setRefreshCookie(req.res, token);
    }
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token con rotación de refresh token' })
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const token = req.cookies?.refresh_token;
    if (!token) {
      throw new UnauthorizedException('Refresh token no proporcionado');
    }
    try {
      const payload = this.jwtService.verify<{ sub: string; jti: string; exp: number }>(token, {
        secret: this.refreshSecret,
      });

      if (this.tokenBlacklist.has(payload.jti)) {
        throw new UnauthorizedException('Refresh token ya fue invalidado');
      }

      this.tokenBlacklist.add(payload.jti, payload.exp * 1000);

      const result = await this.authService.refresh(payload.sub);

      const { token: newRefreshToken, jti: newJti } = this.generateRefreshToken(result.user.id);
      if (req.res) {
        this.setRefreshCookie(req.res, newRefreshToken);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión invalidando refresh token' })
  logout(@Req() req: Request) {
    const token = req.cookies?.refresh_token;
    if (token) {
      try {
        const payload = this.jwtService.verify<{ jti: string; exp: number }>(token, {
          secret: this.refreshSecret,
          ignoreExpiration: true,
        });
        this.tokenBlacklist.add(payload.jti, payload.exp * 1000);
      } catch {
        // token malformed — proceed to clear cookie
      }
    }
    if (req.res) {
      req.res.clearCookie('refresh_token');
    }
    return { message: 'Sesión cerrada' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar operador autenticado' })
  async me(@Req() req: Request) {
    return this.authService.getProfile((req as any).user.id);
  }
}

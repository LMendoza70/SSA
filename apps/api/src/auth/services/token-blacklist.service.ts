import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blacklist = new Map<string, number>();

  add(jti: string, expiresAtMs: number): void {
    this.blacklist.set(jti, expiresAtMs);
  }

  has(jti: string): boolean {
    this.removeExpired();
    return this.blacklist.has(jti);
  }

  private removeExpired(): void {
    const now = Date.now();
    for (const [jti, expiry] of this.blacklist.entries()) {
      if (expiry <= now) {
        this.blacklist.delete(jti);
      }
    }
  }
}

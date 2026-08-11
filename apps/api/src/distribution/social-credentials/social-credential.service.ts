import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CredentialSet {
  platform: string;
  credentials: Record<string, string>;
}

@Injectable()
export class SocialCredentialService {
  private readonly logger = new Logger(SocialCredentialService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCredentials(platform: string): Promise<Record<string, string>> {
    const rows = await this.prisma.socialCredential.findMany({
      where: { platform },
    });
    const creds: Record<string, string> = {};
    for (const row of rows) {
      creds[row.credentialKey] = row.credentialValue;
    }
    return creds;
  }

  async getCredential(platform: string, key: string): Promise<string | null> {
    const record = await this.prisma.socialCredential.findUnique({
      where: { platform_credentialKey: { platform, credentialKey: key } },
    });
    return record?.credentialValue ?? null;
  }

  async setCredentials(
    platform: string,
    credentials: Record<string, string>,
    description?: string,
  ): Promise<void> {
    const ops = Object.entries(credentials).map(([key, value]) =>
      this.prisma.socialCredential.upsert({
        where: { platform_credentialKey: { platform, credentialKey: key } },
        update: { credentialValue: value, description },
        create: { platform, credentialKey: key, credentialValue: value, description },
      }),
    );
    await this.prisma.$transaction(ops);
    this.logger.log(`Credentials updated for ${platform}`);
  }

  async deleteCredentials(platform: string): Promise<void> {
    await this.prisma.socialCredential.deleteMany({ where: { platform } });
    this.logger.log(`Credentials deleted for ${platform}`);
  }

  async hasCredentials(platform: string, requiredKeys: string[]): Promise<boolean> {
    const existing = await this.prisma.socialCredential.findMany({
      where: { platform },
      select: { credentialKey: true },
    });
    const existingKeys = new Set(existing.map((r) => r.credentialKey));
    return requiredKeys.every((k) => existingKeys.has(k));
  }

  async listPlatforms(): Promise<string[]> {
    const rows = await this.prisma.socialCredential.findMany({
      distinct: ['platform'],
      select: { platform: true },
    });
    return rows.map((r) => r.platform);
  }
}
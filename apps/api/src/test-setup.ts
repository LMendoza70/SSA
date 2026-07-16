import { vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRATION = '7d';
process.env.CORS_ORIGIN = 'http://localhost:5173';

vi.mock('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {
    $connect = vi.fn();
    $disconnect = vi.fn();
  },
  ContentStatus: { DRAFT: 'DRAFT', PREPARED: 'PREPARED', NEEDS_REVIEW: 'NEEDS_REVIEW', READY_FOR_PUBLICATION: 'READY_FOR_PUBLICATION', ARCHIVED: 'ARCHIVED' },
  PublicationStatus: { PUBLISHED: 'PUBLISHED', WITHDRAWN: 'WITHDRAWN', ARCHIVED: 'ARCHIVED' },
  TraceabilityAction: { CREATED: 'CREATED', UPDATED: 'UPDATED', PREPARED: 'PREPARED', PUBLISHED: 'PUBLISHED', WITHDRAWN: 'WITHDRAWN', ARCHIVED: 'ARCHIVED', DISTRIBUTED: 'DISTRIBUTED' },
  MediaResourceType: { IMAGE: 'IMAGE', VIDEO: 'VIDEO', PDF: 'PDF', AUDIO: 'AUDIO', EXTERNAL_LINK: 'EXTERNAL_LINK' },
  ChannelType: { FACEBOOK: 'FACEBOOK', INSTAGRAM: 'INSTAGRAM', X: 'X', TIKTOK: 'TIKTOK', YOUTUBE: 'YOUTUBE', WHATSAPP: 'WHATSAPP' },
  DistributionStatus: { PENDING: 'PENDING', PREPARED: 'PREPARED', SHARED: 'SHARED', FAILED: 'FAILED' },
}));

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DistributionService } from './distribution.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('DistributionService', () => {
  let service: DistributionService;
  let mockPrisma: any;
  let mockPublisherFactory: any;
  let mockTraceability: any;

  const mockChannel = {
    id: 'channel-1',
    type: 'FACEBOOK',
    name: 'Facebook Oficial',
    description: 'Página oficial',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  const mockPublication = {
    id: 'pub-1',
    contentId: 'content-1',
    publicTitle: 'Test Publication',
    content: { title: 'Test', summary: 'Sum', body: '<p>Body</p>', slug: 'test' },
    deletedAt: null,
  };

  beforeEach(() => {
    mockPrisma = {
      communicationChannel: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      publication: { findUnique: vi.fn() },
      publicationChannel: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        deleteMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    mockPublisherFactory = {
      getAdapter: vi.fn(),
    };

    mockTraceability = { record: vi.fn() };

    service = new DistributionService(
      mockPrisma as any,
      mockPublisherFactory as any,
      mockTraceability as any,
    );
  });

  describe('Channel CRUD', () => {
    it('should create a communication channel', async () => {
      mockPrisma.communicationChannel.create.mockResolvedValue(mockChannel);

      const result = await service.createChannel({
        type: 'FACEBOOK' as any,
        name: 'Facebook Oficial',
      });

      expect(result).toHaveProperty('id', 'channel-1');
    });

    it('should return all non-deleted channels', async () => {
      mockPrisma.communicationChannel.findMany.mockResolvedValue([mockChannel]);

      const result = await service.findAllChannels();

      expect(result).toHaveLength(1);
    });

    it('should throw NotFoundException when channel not found', async () => {
      mockPrisma.communicationChannel.findUnique.mockResolvedValue(null);

      await expect(service.findChannelById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when channel is soft-deleted', async () => {
      mockPrisma.communicationChannel.findUnique.mockResolvedValue({
        ...mockChannel,
        deletedAt: new Date(),
      });

      await expect(service.findChannelById('channel-1')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete channel', async () => {
      mockPrisma.communicationChannel.findUnique.mockResolvedValue(mockChannel);
      mockPrisma.communicationChannel.update.mockResolvedValue({
        ...mockChannel,
        deletedAt: new Date(),
      });

      await service.removeChannel('channel-1');

      expect(mockPrisma.communicationChannel.update.mock.calls[0][0].data).toHaveProperty('deletedAt');
    });
  });

  describe('Publication Channels', () => {
    it('should associate channels to a publication', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(mockPublication);
      mockPrisma.communicationChannel.findUnique.mockResolvedValue(mockChannel);
      mockPrisma.publicationChannel.findMany.mockResolvedValue([]);

      await service.associatePublicationChannels('pub-1', ['channel-1']);

      expect(mockPrisma.publicationChannel.deleteMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException when publication does not exist for association', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(null);

      await expect(
        service.associatePublicationChannels('nonexistent', ['channel-1']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when channel does not exist for association', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue(mockPublication);
      mockPrisma.communicationChannel.findUnique.mockResolvedValue(null);

      await expect(
        service.associatePublicationChannels('pub-1', ['nonexistent']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Distribution', () => {
    it('should update distribution status to PREPARED', async () => {
      mockPrisma.publicationChannel.findUnique.mockResolvedValue({
        id: 'pc-1',
        status: 'PENDING',
      });
      mockPrisma.publicationChannel.update.mockResolvedValue({
        id: 'pc-1',
        status: 'PREPARED',
        communicationChannel: mockChannel,
      });

      const result = await service.updateDistribution('pc-1', {
        status: 'PREPARED' as any,
        preparedText: 'Texto preparado',
      });

      expect(result).toHaveProperty('status', 'PREPARED');
    });

    it('should throw BadRequestException when no adapter for channel type', async () => {
      mockPrisma.publicationChannel.findUnique.mockResolvedValue({
        id: 'pc-1',
        communicationChannel: { type: 'UNKNOWN' },
        publication: mockPublication,
      });
      mockPublisherFactory.getAdapter.mockReturnValue(null);

      await expect(service.publishToChannel('pc-1')).rejects.toThrow(BadRequestException);
    });
  });
});

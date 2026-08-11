import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { TimelineService } from './timeline.service';

vi.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrisma {},
}));

describe('TimelineService', () => {
  let service: TimelineService;
  let mockPrisma: any;

  const eventId = 'event-1';
  const mockEvent = {
    id: eventId,
    title: 'Evento Histórico',
    slug: 'evento-historico',
    description: 'Descripción del evento',
    occurredAt: new Date('2020-01-01'),
    periodLabel: '2020',
    historicalRelevance: 'ALTA',
    isVisible: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null,
  };

  beforeEach(() => {
    mockPrisma = {
      timelineEvent: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      timelineEventMediaResource: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      timelineEventContent: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    service = new TimelineService(mockPrisma as any);
  });

  describe('create', () => {
    it('should create a timeline event with slug', async () => {
      mockPrisma.timelineEvent.create.mockResolvedValue(mockEvent);

      const result = await service.create({
        title: 'Nuevo Evento',
        description: 'Descripcion',
        historicalRelevance: 'ALTA' as any,
      });

      const createData = mockPrisma.timelineEvent.create.mock.calls[0][0].data;
      expect(createData.slug).toBe('nuevo-evento');
      expect(result).toHaveProperty('id', eventId);
    });

    it('should create with media and content associations', async () => {
      mockPrisma.timelineEvent.create.mockResolvedValue(mockEvent);

      await service.create({
        title: 'Evento Histórico',
        description: 'Descripción',
        historicalRelevance: 'MEDIA' as any,
        mediaResourceIds: ['media-1', 'media-2'],
        contentIds: ['content-1'],
      });

      const createData = mockPrisma.timelineEvent.create.mock.calls[0][0].data;
      expect(createData.timelineEventMediaResources.create).toHaveLength(2);
      expect(createData.timelineEventContents.create).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted events ordered by occurredAt desc', async () => {
      mockPrisma.timelineEvent.findMany.mockResolvedValue([mockEvent]);

      const result = await service.findAll();

      const query = mockPrisma.timelineEvent.findMany.mock.calls[0][0];
      expect(query.where.deletedAt).toBeNull();
      expect(query.orderBy.occurredAt).toBe('desc');
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when event does not exist', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when event is soft-deleted', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue({ ...mockEvent, deletedAt: new Date() });

      await expect(service.findById(eventId)).rejects.toThrow(NotFoundException);
    });

    it('should return event when found', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(mockEvent);

      const result = await service.findById(eventId);

      expect(result).toHaveProperty('id', eventId);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when event does not exist', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', { title: 'New' })).rejects.toThrow(NotFoundException);
    });

    it('should update event title and regenerate slug', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.$transaction.mockImplementation(async (cb: any) => {
        const tx = {
          timelineEventMediaResource: mockPrisma.timelineEventMediaResource,
          timelineEventContent: mockPrisma.timelineEventContent,
          timelineEvent: {
            update: mockPrisma.timelineEvent.update,
          },
        };
        return typeof cb === 'function' ? cb(tx) : cb;
      });
      mockPrisma.timelineEvent.update.mockResolvedValue({ ...mockEvent, title: 'Updated' });

      const result = await service.update(eventId, { title: 'Updated Title' });

      expect(mockPrisma.timelineEvent.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when event does not exist', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete event', async () => {
      mockPrisma.timelineEvent.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.timelineEvent.update.mockResolvedValue({ ...mockEvent, deletedAt: new Date() });

      await service.remove(eventId);

      const updateData = mockPrisma.timelineEvent.update.mock.calls[0][0].data;
      expect(updateData).toHaveProperty('deletedAt');
    });
  });
});


import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification successfully', async () => {
      const createdAt = new Date('2026-11-15');

      const createDto = {
        userId: 1,
        bookingId: 2,
        type: 'BOOKING',
        message: 'Your booking has been created',
        isRead: false,
        createdAt,
      };

      const createdNotification = {
        id: 1,
        user_id: 1,
        booking_id: 2,
        type: 'BOOKING',
        message: 'Your booking has been created',
        is_read: false,
        created_at: createdAt,
      };

      mockPrismaService.notification.create.mockResolvedValue(
        createdNotification,
      );

      const result = await service.create(createDto as any);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          booking_id: 2,
          type: 'BOOKING',
          message: 'Your booking has been created',
          is_read: false,
          created_at: createdAt,
        },
      });

      expect(result).toEqual(createdNotification);
    });

    it('should return undefined when notification creation fails', async () => {
      mockPrismaService.notification.create.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.create({
        userId: 1,
        bookingId: 2,
        type: 'BOOKING',
        message: 'Test notification',
        isRead: false,
      } as any);

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const notifications = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(
        notifications,
      );

      const result = await service.findAll();

      expect(mockPrismaService.notification.findMany).toHaveBeenCalled();
      expect(result).toEqual(notifications);
    });
  });

  describe('findOne', () => {
    it('should return a notification by ID', async () => {
      const notification = {
        id: 1,
        message: 'Test notification',
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        notification,
      );

      const result = await service.findOne(1);

      expect(mockPrismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(notification);
    });
  });

  describe('update', () => {
    it('should update a notification successfully', async () => {
      const updateDto = {
        message: 'Updated notification',
        isRead: true,
      };

      const updatedNotification = {
        id: 1,
        message: 'Updated notification',
        isRead: true,
      };

      mockPrismaService.notification.update.mockResolvedValue(
        updatedNotification,
      );

      const result = await service.update(1, updateDto as any);

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });

      expect(result).toEqual(updatedNotification);
    });
  });

  describe('remove', () => {
    it('should delete a notification successfully', async () => {
      const deletedNotification = { id: 1 };

      mockPrismaService.notification.delete.mockResolvedValue(
        deletedNotification,
      );

      const result = await service.remove(1);

      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(deletedNotification);
    });
  });
});

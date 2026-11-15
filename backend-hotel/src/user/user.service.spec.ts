import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
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
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'USER',
        isActive: true,
      };

      const createdUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
      };

      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto as any);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password_hash: 'hashed-password',
          role: 'USER',
          is_active: true,
        }),
      });

      expect(result).toEqual(createdUser);
    });

    it('should create a user with nested booking, notification, and refresh token records', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'USER',
        isActive: true,
        booking: [
          {
            userId: 1,
            roomId: 2,
            checkIn: new Date('2026-12-01'),
            checkOut: new Date('2026-12-03'),
            guest: 2,
            status: 'PENDING',
            pricePerNight: 1000,
            totalAmount: 2000,
          },
        ],
        notification: [
          {
            bookingId: 1,
            type: 'BOOKING',
            message: 'Booking created',
            isRead: false,
          },
        ],
        refreshToken: [
          {
            tokenHash: 'hashed-token',
            expiresAt: new Date('2026-12-31'),
            revokedAt: null,
          },
        ],
      };

      mockPrismaService.user.create.mockResolvedValue({ id: 1 });

      await service.create(createUserDto as any);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          booking: {
            create: [
              expect.objectContaining({
                user_id: 1,
                room_id: 2,
                guest: 2,
                status: 'PENDING',
              }),
            ],
          },
          notification: {
            create: [
              expect.objectContaining({
                booking_id: 1,
                message: 'Booking created',
                is_read: false,
              }),
            ],
          },
          refresh_token: {
            create: [
              expect.objectContaining({
                token_hash: 'hashed-token',
                revoked_at: null,
              }),
            ],
          },
        }),
      });
    });

    it('should return undefined when user creation fails', async () => {
      mockPrismaService.user.create.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.create({
        name: 'Test User',
      } as any);

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1 }, { id: 2 }];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'Test User' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOneByEmail('test@example.com');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, {
        name: 'Updated User',
        email: 'updated@example.com',
      } as any);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'Updated User',
          email: 'updated@example.com',
          updated_at: expect.any(Date),
        }),
      });

      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const deletedUser = { id: 1 };

      mockPrismaService.user.delete.mockResolvedValue(deletedUser);

      const result = await service.remove(1);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(deletedUser);
    });
  });
});
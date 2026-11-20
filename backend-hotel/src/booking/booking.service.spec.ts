import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';

describe('BookingService', () => {
  let service: BookingService;

  

  const mockPrismaService = {
  booking: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

  const mockRefreshTokenService = {
    findOneFromToken: jest.fn(),
  };

  const mockRoomService = {
    findARoom: jest.fn(),
    update: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: RoomService, useValue: mockRoomService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking successfully', async () => {
      const checkIn = new Date('2026-12-01');
      const checkOut = new Date('2026-12-05');

      const dto = {
        userId: 1,
        roomId: 2,
        checkIn,
        checkOut,
        guest: 2,
        status: 'CONFIRMED',
        pricePerNight: 1500,
        totalAmount: 6000,
        createdAt: checkIn,
        updatedAt: checkIn,
      } as any;

      const expectedBooking = { id: 1, ...dto };

      mockPrismaService.booking.create.mockResolvedValue(expectedBooking);

      mockRoomService.findARoom.mockResolvedValue({
        id: 2,
        is_active: true,
        capacity: 4,
        price_per_night: 150,
      });

      mockPrismaService.booking.findFirst.mockResolvedValue(null);

      const result = await service.create(dto);

      expect(mockPrismaService.booking.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          room_id: 2,
          check_in: checkIn,
          check_out: checkOut,
          guest: 2,
          status: 'CONFIRMED',
          price_per_night: 150,
          total_amount: 600,
          notification: undefined,
        },
      });

      expect(result).toEqual(expectedBooking);
    });
     it('should reject a booking when the room has an overlapping booking', async () => {
    mockRoomService.findARoom.mockResolvedValue({
      id: 2,
      is_active: true,
    });

    mockPrismaService.booking.findFirst.mockResolvedValue({
      id: 99,
      room_id: 2,
      status: 'PENDING',
    });

    await expect(
      service.create({
        roomId: 2,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-05'),
      } as any),
    ).rejects.toThrow(BadRequestException);

    expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
  });
    it('should reject a booking with invalid dates', async () => {
      const dto = {
        roomId: 2,
        checkIn: new Date('2026-12-05'),
        checkOut: new Date('2026-12-01'),
      } as any;

      await expect(service.create(dto))
        .rejects.toThrow(BadRequestException);

      expect(mockRoomService.findARoom).not.toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking when the room does not exist', async () => {
      mockRoomService.findARoom.mockResolvedValue(null);

      const dto = {
        roomId: 999,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-05'),
      } as any;

      await expect(service.create(dto))
        .rejects.toThrow(NotFoundException);

      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking when the room is inactive', async () => {
      mockRoomService.findARoom.mockResolvedValue({
        id: 2,
        is_active: false,
      });

      const dto = {
        roomId: 2,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-05'),
      } as any;

      await expect(service.create(dto))
        .rejects.toThrow(BadRequestException);

      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking with an invalid date value', async () => {
      const dto = {
        roomId: 2,
        checkIn: new Date('invalid-date'),
        checkOut: new Date('2026-12-05'),
      } as any;

      await expect(service.create(dto))
        .rejects.toThrow(BadRequestException);

      expect(mockRoomService.findARoom).not.toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it.each(['APPROVED', 'PAID'])(
        'should reject booking when another booking has status %s',
        async (status) => {
          mockRoomService.findARoom.mockResolvedValue({
            id: 2,
            is_active: true,
          });

          mockPrismaService.booking.findFirst.mockResolvedValue({
            id: 99,
            room_id: 2,
            status,
          });

          await expect(
            service.create({
              roomId: 2,
              checkIn: new Date('2026-12-01'),
              checkOut: new Date('2026-12-05'),
            } as any),
          ).rejects.toThrow(BadRequestException);

          expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
        },
      );
      it('should allow booking when there is no active booking conflict', async () => {
          mockRoomService.findARoom.mockResolvedValue({
            id: 2,
            is_active: true,
          });

          mockPrismaService.booking.findFirst.mockResolvedValue(null);

          mockPrismaService.booking.create.mockResolvedValue({
            id: 10,
            room_id: 2,
          });

          const dto = {
            roomId: 2,
            guest: 2,
            checkIn: new Date('2026-12-01'),
            checkOut: new Date('2026-12-05'),
          } as any;

          await service.create(dto);

          expect(mockPrismaService.booking.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
              where: expect.objectContaining({
                status: {
                  in: ['PENDING', 'APPROVED', 'PAID'],
                },
              }),
            }),
          );

          expect(mockPrismaService.booking.create).toHaveBeenCalled();
        });
    it('should reject booking with zero guests', async () => {
        mockRoomService.findARoom.mockResolvedValue({
          id: 2,
          is_active: true,
          capacity: 4,
        });

        await expect(
          service.create({
            roomId: 2,
            guest: 0,
            checkIn: new Date('2026-12-01'),
            checkOut: new Date('2026-12-05'),
          } as any),
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });
    it('should reject booking with negative guests', async () => {
      mockRoomService.findARoom.mockResolvedValue({
        id: 2,
        is_active: true,
        capacity: 4,
      });

      await expect(
        service.create({
          roomId: 2,
          guest: -1,
          checkIn: new Date('2026-12-01'),
          checkOut: new Date('2026-12-05'),
        } as any),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });
    it('should reject booking when guests exceed room capacity', async () => {
      mockRoomService.findARoom.mockResolvedValue({
        id: 2,
        is_active: true,
        capacity: 4,
      });

      await expect(
        service.create({
          roomId: 2,
          guest: 5,
          checkIn: new Date('2026-12-01'),
          checkOut: new Date('2026-12-05'),
        } as any),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });
    it('should calculate booking price from the room price instead of client input', async () => {
      const dto = {
        userId: 1,
        roomId: 2,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-05'),
        guest: 2,
        status: 'CONFIRMED',
        pricePerNight: 9999,
        totalAmount: 99999,
        createdAt: new Date('2026-12-01'),
        updatedAt: new Date('2026-12-01'),
      };

      mockRoomService.findARoom.mockResolvedValue({
        id: 2,
        is_active: true,
        capacity: 4,
        price_per_night: 150,
      });

      mockPrismaService.booking.findFirst.mockResolvedValue(null);
      mockPrismaService.booking.create.mockResolvedValue({ id: 1 });

      await service.create(dto as any);

      expect(mockPrismaService.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            price_per_night: 150,
            total_amount: 600,
          }),
        }),
      );
    });
  });

  
describe('createForUser', () => {
  const validDto = {
    roomId: 3,
    checkIn: new Date('2026-12-01'),
    checkOut: new Date('2026-12-05'),
    guest: 2,
    status: 'PENDING',
    pricePerNight: 9999,
    totalAmount: 99999,
  };

  it('should throw UnauthorizedException when JWT token is missing', async () => {
    await expect(
      service.createForUser(null as any, validDto as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when JWT token is invalid', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue(null);

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        validDto as any,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw NotFoundException when room does not exist', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({});
    mockRoomService.findARoom.mockResolvedValue(null);

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        validDto as any,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when room is inactive', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({});
    mockRoomService.findARoom.mockResolvedValue({
      id: 3,
      is_active: false,
      capacity: 4,
      price_per_night: 200,
    });

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        validDto as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when guest count is less than 1', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({});
    mockRoomService.findARoom.mockResolvedValue({
      id: 3,
      is_active: true,
      capacity: 4,
      price_per_night: 200,
    });

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        { ...validDto, guest: 0 } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when guest count exceeds room capacity', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({});
    mockRoomService.findARoom.mockResolvedValue({
      id: 3,
      is_active: true,
      capacity: 4,
      price_per_night: 200,
    });

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        { ...validDto, guest: 5 } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject booking when dates conflict with an existing booking', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({});
    mockRoomService.findARoom.mockResolvedValue({
      id: 3,
      is_active: true,
      capacity: 4,
      price_per_night: 200,
    });

    mockPrismaService.booking.findFirst.mockResolvedValue({
      id: 10,
      room_id: 3,
      status: 'APPROVED',
    });

    await expect(
      service.createForUser(
        { token: 'valid-token' } as any,
        validDto as any,
      ),
    ).rejects.toThrow();
  });

  it('should create a booking using the room price and actual user ID', async () => {
  mockRefreshTokenService.findOneFromToken.mockResolvedValue({
    user_id: 42,
  });

  mockRoomService.findARoom.mockResolvedValue({
    id: 3,
    is_active: true,
    capacity: 4,
    price_per_night: 200,
  });

  mockPrismaService.booking.findFirst.mockResolvedValue(null);

  mockPrismaService.booking.create.mockResolvedValue({
    id: 1,
    user_id: 42,
    room_id: 3,
    price_per_night: 200,
    total_amount: 800,
  });

  await service.createForUser(
    { token: 'valid-token' } as any,
    validDto as any,
  );

  expect(mockPrismaService.booking.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      user_id: 42,
      room_id: 3,
      price_per_night: 200,
      total_amount: 800,
    }),
  });
});
});


  describe('findAllForUser', () => {
  it('should return only bookings belonging to the authenticated user', async () => {
    const bookings = [
      { id: 1, user_id: 42, room_id: 3 },
      { id: 2, user_id: 42, room_id: 4 },
    ];

    mockRefreshTokenService.findOneFromToken.mockResolvedValue({
      user_id: 42,
    });

    mockPrismaService.booking.findMany.mockResolvedValue(bookings);

    const result = await service.findAllForUser({
      token: 'valid-token',
    });

    expect(result).toEqual(bookings);
    expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
      where: { user_id: 42 },
    });
  });

  it('should reject an invalid token', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue(null);

    await expect(
      service.findAllForUser({ token: 'invalid-token' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockPrismaService.booking.findMany).not.toHaveBeenCalled();
  });
});

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const bookings = [
        { id: 1, room_id: 2 },
        { id: 2, room_id: 3 },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll();

      expect(result).toEqual(bookings);
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith();
    });
    
  });
  describe('findOneForUser', () => {
  it('should return a booking belonging to the authenticated user', async () => {
    const booking = {
      id: 10,
      user_id: 42,
      room_id: 3,
    };

    mockRefreshTokenService.findOneFromToken.mockResolvedValue({
      user_id: 42,
    });

    mockPrismaService.booking.findFirst.mockResolvedValue(booking);

    const result = await service.findOneForUser(
      { token: 'valid-token' },
      10,
    );

    expect(result).toEqual(booking);
    expect(mockPrismaService.booking.findFirst).toHaveBeenCalledWith({
      where: {
        id: 10,
        user_id: 42,
      },
    });
  });

  it('should reject an invalid token', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue(null);

    await expect(
      service.findOneForUser({ token: 'invalid-token' }, 10),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockPrismaService.booking.findFirst).not.toHaveBeenCalled();
  });
});

  describe('findOne', () => {
    it('should return a booking by ID', async () => {
      const booking = { id: 1, room_id: 2 };

      mockPrismaService.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne(1);

      expect(result).toEqual(booking);
      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });


  describe('update', () => {
    it('should update a booking and create a notification', async () => {
      const updatedBooking = {
        id: 1,
        user_id: 2,
        room_id: 3,
        status: 'CONFIRMED',
      };

      mockRoomService.findARoom.mockResolvedValue({
        id: 3,
        is_active: true,
        capacity: 4,
        price_per_night: 200,
      });

      mockPrismaService.booking.findUnique.mockResolvedValue({
        id: 1,
        user_id: 2,
        room_id: 3,
        check_in: new Date('2026-12-01'),
        check_out: new Date('2026-12-05'),
        guest: 2,
        status: 'PENDING',
      });

      mockPrismaService.booking.findFirst.mockResolvedValue(null);

      mockPrismaService.booking.update.mockResolvedValue(updatedBooking);
      mockNotificationService.create.mockResolvedValue({ id: 1 });

      const dto = {
        status: 'CONFIRMED',
      } as any;

      const result = await service.update(1, dto);

      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          status: 'CONFIRMED',
          updated_at: expect.any(Date),
        }),
      });

      expect(mockNotificationService.create).toHaveBeenCalledWith({
        userId: 2,
        bookingId: 1,
        type: 'BOOKING_CREATED',
        message: 'A booking has been updated',
        isRead: false,
        createdAt: expect.any(Date),
      });

      expect(result).toEqual(updatedBooking);
    });

    it('should reject an update when the new dates overlap another booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue({
        id: 1,
        user_id: 2,
        room_id: 3,
        check_in: new Date('2026-12-01'),
        check_out: new Date('2026-12-05'),
        status: 'PENDING',
      });

      mockPrismaService.booking.findFirst.mockResolvedValue({
        id: 2,
        room_id: 3,
        status: 'APPROVED',
      });

      const updateDto = {
        roomId: 3,
        checkIn: new Date('2026-12-03'),
        checkOut: new Date('2026-12-07'),
      } as any;

      await expect(service.update(1, updateDto))
        .rejects.toThrow(BadRequestException);

      expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
    });
    it('should reject update when the new room does not exist', async () => {
        mockPrismaService.booking.findUnique.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          check_in: new Date('2026-12-01'),
          check_out: new Date('2026-12-05'),
          status: 'PENDING',
          guest: 2,
        });

        mockRoomService.findARoom.mockResolvedValue(null);

        await expect(
          service.update(1, { roomId: 999 } as any),
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
    });

    it('should reject update when the new room is inactive', async () => {
        mockPrismaService.booking.findUnique.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          check_in: new Date('2026-12-01'),
          check_out: new Date('2026-12-05'),
          status: 'PENDING',
        });

        mockRoomService.findARoom.mockResolvedValue({
          id: 4,
          is_active: false,
        });

        await expect(
          service.update(1, { roomId: 4 } as any),
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
      });
      it('should reject update with zero guests', async () => {
        mockPrismaService.booking.findUnique.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          check_in: new Date('2026-12-01'),
          check_out: new Date('2026-12-05'),
          guest: 2,
          status: 'PENDING',
        });

        await expect(
          service.update(1, { guest: 0 } as any),
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
      });
      it('should reject update when guests exceed room capacity', async () => {
        mockPrismaService.booking.findUnique.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          check_in: new Date('2026-12-01'),
          check_out: new Date('2026-12-05'),
          guest: 2,
          status: 'PENDING',
        });

        mockRoomService.findARoom.mockResolvedValue({
          id: 3,
          is_active: true,
          capacity: 2,
        });

        await expect(
          service.update(1, { guest: 3 } as any),
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
      });
      it('should calculate updated booking price from the room price instead of client input', async () => {
        mockPrismaService.booking.findUnique.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          check_in: new Date('2026-12-01'),
          check_out: new Date('2026-12-05'),
          guest: 2,
          status: 'PENDING',
        });

        mockRoomService.findARoom.mockResolvedValue({
          id: 3,
          is_active: true,
          capacity: 4,
          price_per_night: 200,
        });

        mockPrismaService.booking.findFirst.mockResolvedValue(null);

        mockPrismaService.booking.update.mockResolvedValue({
          id: 1,
          user_id: 2,
          room_id: 3,
          price_per_night: 200,
          total_amount: 800,
        });

        mockNotificationService.create.mockResolvedValue({ id: 1 });

        await service.update(1, {
          pricePerNight: 9999,
          totalAmount: 99999,
        } as any);

        expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: expect.objectContaining({
            price_per_night: 200,
            total_amount: 800,
          }),
        });
      });

  });


  describe('remove', () => {
    it('should delete a booking and create a cancellation notification', async () => {
      const deletedBooking = {
        id: 1,
        user_id: 2,
      };


      mockPrismaService.booking.delete.mockResolvedValue(deletedBooking);
      mockNotificationService.create.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockNotificationService.create).toHaveBeenCalledWith({
        userId: 2,
        bookingId: 1,
        type: 'BOOKING_CANCELLED',
        message: 'A booking has been cancel',
        isRead: false,
        createdAt: expect.any(Date),
      });

      expect(result).toEqual(deletedBooking);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {},
}));

jest.mock('../auth/guards/role-auth.guard', () => ({
  RolesGuard: class MockRolesGuard {},
}));

describe('BookingController', () => {
  let controller: BookingController;

  const mockBookingService = {
    create: jest.fn(),
    createForUser: jest.fn(),
    findAll: jest.fn(),
    findAllForUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const createBookingDto = {
    roomId: 1,
    userId: 2,
    checkIn: new Date('2026-12-01'),
    checkOut: new Date('2026-12-03'),
    guest: 2,
  } as CreateBookingDto;

  const updateBookingDto = {
    guest: 3,
  } as UpdateBookingDto;

  const sampleBooking = {
    id: 1,
    room_id: 1,
    user_id: 2,
    guest: 2,
    status: 'PENDING',
  };

  const sampleBookings = [sampleBooking];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [BookingController],
        providers: [
          {
            provide: BookingService,
            useValue: mockBookingService,
          },
        ],
      }).compile();

    controller = module.get<BookingController>(
      BookingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking for Admin', async () => {
      mockBookingService.create.mockResolvedValue(sampleBooking);

      await expect(
        controller.create(createBookingDto),
      ).resolves.toEqual(sampleBooking);

      expect(mockBookingService.create).toHaveBeenCalledWith(
        createBookingDto,
      );
    });
  });

  describe('createForUser', () => {
    it('should create a booking using the extracted JWT token', async () => {
      mockBookingService.createForUser.mockResolvedValue(
        sampleBooking,
      );

      const authorization = 'Bearer test-jwt-token';

      await expect(
        controller.createForUser(
          authorization,
          createBookingDto,
        ),
      ).resolves.toEqual(sampleBooking);

      expect(
        mockBookingService.createForUser,
      ).toHaveBeenCalledWith(
        { token: 'test-jwt-token' },
        createBookingDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      mockBookingService.findAll.mockResolvedValue(
        sampleBookings,
      );

      await expect(
        controller.findAll(),
      ).resolves.toEqual(sampleBookings);

      expect(
        mockBookingService.findAll,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForUser', () => {
    it('should return bookings belonging to the authenticated user', async () => {
      mockBookingService.findAllForUser.mockResolvedValue(
        sampleBookings,
      );

      const authorization = 'Bearer user-jwt-token';

      await expect(
        controller.findAllForUser(authorization),
      ).resolves.toEqual(sampleBookings);

      expect(
        mockBookingService.findAllForUser,
      ).toHaveBeenCalledWith({
        token: 'user-jwt-token',
      });
    });
  });

  describe('findOne', () => {
    it('should return one booking by ID', async () => {
      mockBookingService.findOne.mockResolvedValue(
        sampleBooking,
      );

      await expect(
        controller.findOne('1'),
      ).resolves.toEqual(sampleBooking);

      expect(mockBookingService.findOne).toHaveBeenCalledWith(
        1,
      );
    });
  });

  describe('update', () => {
    it('should update a booking by ID', async () => {
      const updatedBooking = {
        ...sampleBooking,
        guest: 3,
      };

      mockBookingService.update.mockResolvedValue(
        updatedBooking,
      );

      await expect(
        controller.update('1', updateBookingDto),
      ).resolves.toEqual(updatedBooking);

      expect(mockBookingService.update).toHaveBeenCalledWith(
        1,
        updateBookingDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a booking by ID', async () => {
      const result = {
        message: 'Booking removed successfully',
      };

      mockBookingService.remove.mockResolvedValue(result);

      await expect(
        controller.remove('1'),
      ).resolves.toEqual(result);

      expect(mockBookingService.remove).toHaveBeenCalledWith(
        1,
      );
    });
  });
});

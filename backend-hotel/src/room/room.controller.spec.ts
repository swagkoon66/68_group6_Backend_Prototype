import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SearchRoomParamDto } from './dto/search-room-param.dto';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

jest.mock('../auth/guards/role-auth.guard', () => ({
  RolesGuard: class RolesGuard {},
}));
jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

jest.mock('../auth/guards/role-auth.guard', () => ({
  RolesGuard: class RolesGuard {},
}));

const mockPrismaService = {
  room: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@nestjs/cache-manager', () => ({
  CacheInterceptor: class {},
  CacheTTL: () => () => {},
  CacheModule: { register: () => ({ module: class {} }) },
}));

describe('RoomController Integration', () => {
  let controller: RoomController;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        RoomService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CREATE
  describe('create', () => {
    it('should create a room through the service', async () => {
      const dto: CreateRoomDto = {
        name: 'Room 1',
        capacity: 2,
        pricePerNight: 1000,
      };

      const result = {
        id: 1,
        name: 'Room 1',
        capacity: 2,
        price_per_night: 1000,
        is_active: true,
      };

      mockPrismaService.room.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);

      expect(mockPrismaService.room.create).toHaveBeenCalledWith({
        data: {
          name: 'Room 1',
          description: undefined,
          capacity: 2,
          price_per_night: 1000,
          is_active: true,
          booking: undefined,
          room_image: undefined,
        },
      });
    });
  });

  // FIND ALL
  describe('findAll', () => {
    it('should return all rooms', async () => {
      const rooms = [
        { id: 1, name: 'Room 1' },
        { id: 2, name: 'Room 2' },
      ];

      mockPrismaService.room.findMany.mockResolvedValue(rooms);

      expect(await controller.findAll()).toEqual(rooms);
      expect(mockPrismaService.room.findMany).toHaveBeenCalledWith();
    });
  });

  // FIND ONE
  describe('findOne', () => {
    it('should return a room by ID', async () => {
      const room = { id: 1, name: 'Room 1' };

      mockPrismaService.room.findUnique.mockResolvedValue(room);

      expect(await controller.findOne(1)).toEqual(room);

      expect(mockPrismaService.room.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if the room does not exist', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // UPDATE
  describe('update', () => {
    it('should update a room', async () => {
      const dto: UpdateRoomDto = {
        name: 'Updated Room',
      };

      const result = {
        id: 1,
        name: 'Updated Room',
      };

      mockPrismaService.room.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'Updated Room',
          updated_at: expect.any(Date),
        }),
      });
    });
  });

  // REMOVE
  describe('remove', () => {
    it('should remove a room', async () => {
      const result = { id: 1, name: 'Room 1' };

      mockPrismaService.room.delete.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);

      expect(mockPrismaService.room.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should propagate an error if the room does not exist', async () => {
      const error = new Error('Record to delete not found.');
      Object.assign(error, { code: 'P2025' });

      mockPrismaService.room.delete.mockRejectedValue(error);

      await expect(controller.remove('999')).rejects.toThrow(
        'Record to delete not found.',
      );
    });
  });

  // ENABLE
  describe('enable', () => {
    it('should enable a room', async () => {
      const room = { id: 1, name: 'Room 1' };
      const result = { ...room, is_active: true };

      mockPrismaService.room.findUnique.mockResolvedValue(room);
      mockPrismaService.room.update.mockResolvedValue(result);

      expect(await controller.enable(1)).toEqual(result);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_active: true },
      });
    });

    it('should throw NotFoundException if the room does not exist', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(
        controller.enable(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // DISABLE
  describe('disable', () => {
    it('should disable a room', async () => {
      const room = { id: 1, name: 'Room 1' };
      const result = { ...room, is_active: false };

      mockPrismaService.room.findUnique.mockResolvedValue(room);
      mockPrismaService.room.update.mockResolvedValue(result);

      expect(await controller.disable(1)).toEqual(result);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_active: false },
      });
    });

    it('should throw NotFoundException if the room does not exist', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(
        controller.disable(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // SEARCH
  describe('search', () => {
    it('should return rooms matching the search criteria', async () => {
      const searchDto: SearchRoomParamDto = {
        name: 'Deluxe',
      };

      const rooms = [
        { id: 1, name: 'Deluxe Room' },
      ];

      mockPrismaService.room.findMany.mockResolvedValue(rooms);

      expect(await controller.search(searchDto)).toEqual(rooms);

      expect(mockPrismaService.room.findMany).toHaveBeenCalledWith({
            where: {
                 name: { contains: 'Deluxe' },
                  is_active: true,
             },
      });
    });
  });
});

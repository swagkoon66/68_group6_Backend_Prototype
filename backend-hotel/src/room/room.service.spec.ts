
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SearchRoomParamDto } from './dto/search-room-param.dto';
import { Prisma } from '@prisma/client/scripts/default-index.js';

const mockPrismaService = {
  room: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Test Room',
        capacity: 2,
        pricePerNight: 1000,
      };

      const createdRoom = {
        id: 1,
        name: 'Test Room',
        capacity: 2,
        price_per_night: 1000,
        is_active: true,
      };

      mockPrismaService.room.create.mockResolvedValue(createdRoom);

      expect(await service.create(createRoomDto)).toEqual(createdRoom);

      expect(mockPrismaService.room.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Room',
          description: undefined,
          capacity: 2,
          price_per_night: 1000,
          is_active: true,
          booking: undefined,
          room_image: undefined,
        },
      });
    });
    it('should create a room with nested bookings and images', async () => {
  const createRoomDto = {
    name: 'Deluxe Room',
    capacity: 3,
    pricePerNight: 2000,
    isActive: false,
    booking: [
      {
        userId: 1,
        roomId: 2,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-03'),
        guest: 2,
        status: 'PENDING',
        pricePerNight: 2000,
        totalAmount: 4000,
      },
    ],
    roomImage: [
      {
        roomId: 2,
        url: 'https://example.com/room.jpg',
        storageKey: 'room-2',
        mimeType: 'image/jpeg',
        fileSize: 1024,
        isPrimary: true,
      },
    ],
  };

  const createdRoom = { id: 2, name: 'Deluxe Room' };

  mockPrismaService.room.create.mockResolvedValue(createdRoom);

  const result = await service.create(createRoomDto as any);

  expect(result).toEqual(createdRoom);

  expect(mockPrismaService.room.create).toHaveBeenCalledWith({
    data: {
      name: 'Deluxe Room',
      description: undefined,
      capacity: 3,
      price_per_night: 2000,
      is_active: false,
      booking: {
        create: [
          expect.objectContaining({
            user_id: 1,
            room_id: 2,
            guest: 2,
          }),
        ],
      },
      room_image: {
        create: [
          expect.objectContaining({
            roomId: 2,
            url: 'https://example.com/room.jpg',
            storage_key: 'room-2',
            mime_type: 'image/jpeg',
          }),
        ],
      },
    },
  });
});

  it('should return undefined when room creation fails', async () => {
    mockPrismaService.room.create.mockRejectedValue(
      new Error('Database error'),
    );

    const result = await service.create({
      name: 'Invalid Room',
      capacity: 2,
      pricePerNight: 1000,
    });

    expect(result).toBeUndefined();
  });
});

  describe('findAll', () => {
    it('should return all rooms', async () => {
      const rooms = [
        { id: 1, name: 'Room 1' },
        { id: 2, name: 'Room 2' },
      ];

      mockPrismaService.room.findMany.mockResolvedValue(rooms);

      expect(await service.findAll()).toEqual(rooms);
      expect(mockPrismaService.room.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findARoom', () => {
    it('should return a room by id', async () => {
      const room = { id: 1, name: 'Room 1' };

      mockPrismaService.room.findUnique.mockResolvedValue(room);

      expect(await service.findARoom(1)).toEqual(room);
      expect(mockPrismaService.room.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if room does not exist', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(service.findARoom(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllRoomThat', () => {
  it('should return rooms matching the search criteria', async () => {
      const searchDto: SearchRoomParamDto = {
        name: 'Deluxe',
        capacity: 2,
        pricePerNight: 1500,
        isActive: true,
      };
      

      const rooms = [{ id: 1, name: 'Deluxe Room' }];

      mockPrismaService.room.findMany.mockResolvedValue(rooms);

      const result = await service.findAllRoomThat(searchDto);

     expect(mockPrismaService.room.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          name: { contains: 'Deluxe' },
          capacity: 2,
          is_active: true,
          price_per_night: expect.anything(),
        }),
      });

const query = mockPrismaService.room.findMany.mock.calls[0][0];

expect(query.where.price_per_night.toString()).toBe('1500');

      expect(result).toEqual(rooms);
    });

    it('should return an empty array when no rooms match', async () => {
      mockPrismaService.room.findMany.mockResolvedValue([]);

      const result = await service.findAllRoomThat({} as any);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when Prisma returns null', async () => {
      mockPrismaService.room.findMany.mockResolvedValue(null);

      await expect(
        service.findAllRoomThat({} as any),
      ).rejects.toThrow(NotFoundException);
    });
    
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: UpdateRoomDto = {
        name: 'Updated Room',
      };

      const updatedRoom = {
        id: 1,
        name: 'Updated Room',
      };

      mockPrismaService.room.update.mockResolvedValue(updatedRoom);

      expect(await service.update(1, updateRoomDto)).toEqual(updatedRoom);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'Updated Room',
          updated_at: expect.any(Date),
        }),
      });
    });
  });
  describe('updateImage', () => {
  it('should update a room image successfully', async () => {
    const image = {
      id: 1,
      room_id: 2,
      url: 'https://example.com/room.jpg',
    };

    const updatedRoom = {
      id: 2,
      room_image: image,
    };

    mockPrismaService.room.update.mockResolvedValue(updatedRoom);

    const result = await service.updateImage(2, image as any);

    expect(mockPrismaService.room.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: {
        room_image: {
          ...image,
        },
        updated_at: expect.any(Date),
      },
    });

    expect(result).toEqual(updatedRoom);
  });
});

  describe('remove', () => {
    it('should remove a room', async () => {
      const removedRoom = { id: 1, name: 'Room 1' };

      mockPrismaService.room.delete.mockResolvedValue(removedRoom);

      expect(await service.remove(1)).toEqual(removedRoom);

      expect(mockPrismaService.room.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('enable', () => {
    it('should enable a room', async () => {
      const room = { id: 1, name: 'Room 1' };
      const updatedRoom = { ...room, is_active: true };

      mockPrismaService.room.findUnique.mockResolvedValue(room);
      mockPrismaService.room.update.mockResolvedValue(updatedRoom);

      expect(await service.enable(1)).toEqual(updatedRoom);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_active: true },
      });
    });
  });

  describe('disable', () => {
    it('should disable a room', async () => {
      const room = { id: 1, name: 'Room 1' };
      const updatedRoom = { ...room, is_active: false };

      mockPrismaService.room.findUnique.mockResolvedValue(room);
      mockPrismaService.room.update.mockResolvedValue(updatedRoom);

      expect(await service.disable(1)).toEqual(updatedRoom);

      expect(mockPrismaService.room.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_active: false },
      });
    });
  });
});

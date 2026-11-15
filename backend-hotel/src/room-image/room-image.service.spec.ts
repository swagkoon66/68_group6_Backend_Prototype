import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageService } from './room-image.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoomService } from '../room/room.service';

describe('RoomImageService', () => {
  let service: RoomImageService;

  const mockPrismaService = {
    room_image: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockRoomService = {
    updateImage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomImageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RoomService,
          useValue: mockRoomService,
        },
      ],
    }).compile();

    service = module.get<RoomImageService>(RoomImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a room image and associate it with a room', async () => {
      const createdAt = new Date('2026-11-15');

      const createRoomImageDto = {
        roomId: 1,
        url: 'https://example.com/room.jpg',
        storageKey: 'room-image-1',
        mimeType: 'image/jpeg',
        fileSize: 1024,
        isPrimary: true,
        createdAt,
      };

      const createdImage = {
        id: 1,
        room_id: 1,
        url: createRoomImageDto.url,
      };

      mockPrismaService.room_image.create.mockResolvedValue(createdImage);
      mockRoomService.updateImage.mockResolvedValue(undefined);

      const result = await service.create(createRoomImageDto as any);

      expect(mockPrismaService.room_image.create).toHaveBeenCalledWith({
        data: {
          room_id: 1,
          url: createRoomImageDto.url,
          storage_key: 'room-image-1',
          mime_type: 'image/jpeg',
          file_size: 1024,
          is_primary: true,
          created_at: createdAt,
        },
      });

      expect(mockRoomService.updateImage).toHaveBeenCalledWith(
        1,
        createdImage,
      );

      expect(result).toEqual(createdImage);
    });

    it('should use the current date when createdAt is not provided', async () => {
      const createdImage = {
        id: 2,
        room_id: 1,
        url: 'https://example.com/room.jpg',
      };

      mockPrismaService.room_image.create.mockResolvedValue(createdImage);

      const beforeCall = new Date();

      await service.create({
        roomId: 1,
        url: 'https://example.com/room.jpg',
      } as any);

      const afterCall = new Date();

      const createCall =
        mockPrismaService.room_image.create.mock.calls[0][0];

      expect(createCall.data.created_at).toBeInstanceOf(Date);
      expect(createCall.data.created_at.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime(),
      );
      expect(createCall.data.created_at.getTime()).toBeLessThanOrEqual(
        afterCall.getTime(),
      );
    });

    it('should return undefined when room ID is null', async () => {
      mockPrismaService.room_image.create.mockResolvedValue({
        id: 1,
        room_id: null,
      });

      const result = await service.create({
        roomId: 1,
        url: 'https://example.com/room.jpg',
      } as any);

      expect(mockRoomService.updateImage).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when image creation fails', async () => {
      mockPrismaService.room_image.create.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.create({
        roomId: 1,
        url: 'https://example.com/room.jpg',
      } as any);

      expect(result).toBeUndefined();
      expect(mockRoomService.updateImage).not.toHaveBeenCalled();
    });

    it('should return undefined when room image association fails', async () => {
      const createdImage = {
        id: 1,
        room_id: 1,
      };

      mockPrismaService.room_image.create.mockResolvedValue(createdImage);
      mockRoomService.updateImage.mockRejectedValue(
        new Error('Room update failed'),
      );

      const result = await service.create({
        roomId: 1,
        url: 'https://example.com/room.jpg',
      } as any);

      expect(mockRoomService.updateImage).toHaveBeenCalledWith(
        1,
        createdImage,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all room images', async () => {
      const images = [{ id: 1 }, { id: 2 }];

      mockPrismaService.room_image.findMany.mockResolvedValue(images);

      const result = await service.findAll();

      expect(mockPrismaService.room_image.findMany).toHaveBeenCalled();
      expect(result).toEqual(images);
    });
  });

  describe('findOne', () => {
    it('should return a room image by ID', async () => {
      const image = { id: 1, room_id: 2 };

      mockPrismaService.room_image.findUnique.mockResolvedValue(image);

      const result = await service.findOne(1);

      expect(mockPrismaService.room_image.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(image);
    });
  });

  describe('update', () => {
    it('should update a room image successfully', async () => {
      const updateDto = {
        url: 'https://example.com/updated.jpg',
      };

      const updatedImage = {
        id: 1,
        url: updateDto.url,
      };

      mockPrismaService.room_image.update.mockResolvedValue(updatedImage);

      const result = await service.update(1, updateDto as any);

      expect(mockPrismaService.room_image.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(result).toEqual(updatedImage);
    });
  });

  describe('remove', () => {
    it('should delete a room image successfully', async () => {
      const deletedImage = { id: 1 };

      mockPrismaService.room_image.delete.mockResolvedValue(deletedImage);

      const result = await service.remove(1);

      expect(mockPrismaService.room_image.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(deletedImage);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {},
}));

jest.mock('@nestjs/cache-manager', () => ({
  CacheInterceptor: class {},
  CacheTTL: () => () => {},
  CacheModule: { register: () => ({ module: class {} }) },
}));

const mockRoomService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findARoom: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  findAllRoomThat: jest.fn(),
};

describe('RoomController Integration', () => {
  let controller: RoomController;
  let service: typeof mockRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: mockRoomService,
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = mockRoomService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateRoomDto = {
        name: 'Room 1',
        capacity: 20,
        pricePerNight: 1500,
      };

      const result = { id: 1, ...dto };
      service.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return rooms', async () => {
      const result = [{ id: 1, name: 'Room 1', capacity: 20 }];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findARoom and return the room', async () => {
      const result = { id: 1, name: 'Room 1', capacity: 20 };
      service.findARoom.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
expect(service.findARoom).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException if room is not found', async () => {
      service.findARoom.mockRejectedValue(
        new NotFoundException('Room 1 not found'),
      );

      await expect(controller.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove and return the result', async () => {
      const result = { id: 1 };
      service.remove.mockResolvedValue(result);

      expect(await controller.remove("1")).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException if room is not found', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Room 999 not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

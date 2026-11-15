
jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageController } from './room-image.controller';
import { RoomImageService } from './room-image.service';


describe('RoomImageController', () => {
  let controller: RoomImageController;

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
  const module: TestingModule = await Test.createTestingModule({
    controllers: [RoomImageController],
    providers: [
      {
        provide: RoomImageService,
        useValue: {},
      },
    ],
  }).compile();

  controller = module.get<RoomImageController>(RoomImageController);
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

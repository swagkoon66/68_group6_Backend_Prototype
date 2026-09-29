import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageController } from './room-image.controller';
import { RoomImageService } from './room-image.service';

describe('RoomImageController', () => {
  let controller: RoomImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomImageController],
      providers: [RoomImageService],
    }).compile();

    controller = module.get<RoomImageController>(RoomImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

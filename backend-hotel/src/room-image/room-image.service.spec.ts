import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageService } from './room-image.service';

describe('RoomImageService', () => {
  let service: RoomImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomImageService],
    }).compile();

    service = module.get<RoomImageService>(RoomImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

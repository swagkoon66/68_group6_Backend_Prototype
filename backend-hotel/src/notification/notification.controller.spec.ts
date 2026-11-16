import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {},
}));


describe('NotificationController', () => {
  let controller: NotificationController;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [NotificationController],
    providers: [
      {
        provide: NotificationService,
        useValue: {},
      },
    ],
  }).compile();

  controller = module.get<NotificationController>(
    NotificationController,
  );
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

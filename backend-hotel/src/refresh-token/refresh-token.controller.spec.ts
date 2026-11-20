import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class MockJwtAuthGuard {},
}));

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;

  const mockPrismaService = {
    refresh_token: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

 beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [RefreshTokenController],
    providers: [
      {
        provide: RefreshTokenService,
        useValue: {},
      },
    ],
  }).compile();

  controller = module.get<RefreshTokenController>(
    RefreshTokenController,
  );
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

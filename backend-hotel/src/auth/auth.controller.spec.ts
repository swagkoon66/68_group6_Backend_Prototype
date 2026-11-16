
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with registration data', async () => {
      const dto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expected = { message: 'User registered successfully' };
      mockAuthService.register.mockResolvedValue(expected);

      await expect(controller.register(dto)).resolves.toEqual(expected);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with login data', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue('access-token');

      await expect(controller.login(dto)).resolves.toBe('access-token');

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout with the token', async () => {
      const tokenObj = { token: 'test-token' };
      const expected = { count: 1 };

      mockAuthService.logout.mockResolvedValue(expected);

      await expect(controller.logout(tokenObj)).resolves.toEqual(expected);

      expect(mockAuthService.logout).toHaveBeenCalledWith(tokenObj);
    });
  });
});

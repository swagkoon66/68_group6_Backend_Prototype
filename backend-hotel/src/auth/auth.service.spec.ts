import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findOneByEmail: jest.fn(),
  };

  const mockRefreshTokenService = {
    DeleteIfTokensExpired: jest.fn(),
    findAllOfUserToken: jest.fn(),
    findOne: jest.fn(),
    findOneFromToken: jest.fn(),
    createLogin: jest.fn(),
    update: jest.fn(),
    removeThatHashed: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('register', () => {
    it('should register a user successfully', async () => {
      process.env.SALT_ROUND = '10';

      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      mockPrismaService.user.create.mockImplementation(async ({ data }) => ({
        id: 1,
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
      }));

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });

      expect(mockPrismaService.user.create).toHaveBeenCalled();

      const createCall = mockPrismaService.user.create.mock.calls[0][0];

      expect(createCall.data.password_hash).not.toBe(registerDto.password);
      expect(result).toEqual({
        message: 'User registered sucessfully',
        user: {
          id: 1,
          email: registerDto.email,
          name: registerDto.name,
          role: 'USER',
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user without password_hash when credentials are valid', async () => {
      const hashedPassword = await require('bcrypt').hash('password123', 10);

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'USER',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
      });

      expect(result).not.toHaveProperty('password_hash');
    });

    it('should return null when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: await require('bcrypt').hash('password123', 10),
        role: 'USER',
      });

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(
        'unknown@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
    };

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(
        mockRefreshTokenService.DeleteIfTokensExpired,
      ).not.toHaveBeenCalled();
    });

    it('should reuse an existing refresh token', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      mockRefreshTokenService.findAllOfUserToken.mockResolvedValue([
        { id: 10 },
      ]);

      mockRefreshTokenService.findOne.mockResolvedValue({
        token_hash: 'existing-token',
      });

      const result = await service.login(loginDto);

      expect(
        mockRefreshTokenService.DeleteIfTokensExpired,
      ).toHaveBeenCalledWith(mockUser.id);

      expect(mockRefreshTokenService.findAllOfUserToken).toHaveBeenCalledWith(
        mockUser.id,
      );

      expect(mockRefreshTokenService.findOne).toHaveBeenCalledWith(10);
      expect(result).toBe('existing-token');
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should generate a JWT when no existing refresh token is available', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      mockRefreshTokenService.findAllOfUserToken.mockResolvedValue([]);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.login(loginDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        user_id: mockUser.id,
        role: mockUser.role,
      });

      expect(mockRefreshTokenService.createLogin).toHaveBeenCalledWith(
        mockUser.id,
        'new-access-token',
      );

      expect(result).toBe('new-access-token');
    });
  });

  describe('logout', () => {
    it('should remove the refresh token successfully', async () => {
      mockRefreshTokenService.removeThatHashed.mockResolvedValue({
        count: 1,
      });

      const result = await service.logout({
        token: 'test-token',
      });

      expect(mockRefreshTokenService.removeThatHashed).toHaveBeenCalledWith(
        'test-token',
      );

      expect(result).toEqual({ count: 1 });
    });
  });

 
describe('refresh', () => {
  const refreshDto = {
    email: 'test@example.com',
    password: 'password123',
    token: 'test-refresh-token',
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  };

  const mockStoredToken = {
    id: 10,
    user_id: 1,
    token_hash: 'test-refresh-token',
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
    revoked_at: null,
  };

  beforeEach(() => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(null);

    await expect(service.refresh(refreshDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(
      mockRefreshTokenService.findOneFromToken,
    ).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when token does not exist', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue(null);

    await expect(service.refresh(refreshDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token belongs to another user', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({
      ...mockStoredToken,
      user_id: 2,
    });

    await expect(service.refresh(refreshDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token has expired', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({
      ...mockStoredToken,
      expires_at: new Date(Date.now() - 1000),
    });

    await expect(service.refresh(refreshDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token has been revoked', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue({
      ...mockStoredToken,
      revoked_at: new Date(),
    });

    await expect(service.refresh(refreshDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should refresh token successfully', async () => {
    mockRefreshTokenService.findOneFromToken.mockResolvedValue(
      mockStoredToken,
    );
    mockJwtService.sign.mockReturnValue('new-refresh-token');
    mockRefreshTokenService.update.mockResolvedValue({
      ...mockStoredToken,
      token_hash: 'new-refresh-token',
    });

    const result = await service.refresh(refreshDto);

    expect(mockRefreshTokenService.findOneFromToken).toHaveBeenCalledWith(
      refreshDto.token,
    );

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      name: mockUser.name,
      email: mockUser.email,
      user_id: mockUser.id,
      role: mockUser.role,
    });

    expect(mockRefreshTokenService.update).toHaveBeenCalledWith(
      mockStoredToken.id,
      expect.objectContaining({
        tokenHash: 'new-refresh-token',
        expiresAt: expect.any(Date),
      }),
    );

    expect(result).toBe('new-refresh-token');
  });
});


});

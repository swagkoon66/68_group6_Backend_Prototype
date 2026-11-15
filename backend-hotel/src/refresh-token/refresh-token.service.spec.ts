import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';


describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let prisma: {
  refresh_token: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
};

  beforeEach(async () => {
    prisma = {
      refresh_token: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a refresh token successfully', async () => {
      const dto = {
        userId: 1,
        tokenHash: 'hashed-token-123',
        expiresAt: new Date('2026-12-01T00:00:00Z'),
        revokedAt: undefined,
      };

      const mockToken = {
        id: 1,
        user_id: 1,
        token_hash: 'hashed-token-123',
        expires_at: dto.expiresAt,
        revoked_at: null,
      };

      prisma.refresh_token.create.mockResolvedValue(mockToken);

      await expect(service.create(dto)).resolves.toEqual(mockToken);

      expect(prisma.refresh_token.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          token_hash: 'hashed-token-123',
          expires_at: dto.expiresAt,
          revoked_at: undefined,
        },
      });
    });
  });
  describe('createLogin', () => {
    it('should create a refresh token during login', async () => {
      const userId = 1;
      const token = 'login-token-123';

      prisma.refresh_token.create.mockImplementation(async ({ data }) => ({
        id: 2,
        ...data,
      }));

      const result = await service.createLogin(userId, token);

      expect(result).toMatchObject({
        id: 2,
        user_id: userId,
        token_hash: token,
      });

      expect(result?.expires_at).toBeInstanceOf(Date);
      expect(result?.revoked_at).toBeNull();

      expect(prisma.refresh_token.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: userId,
          token_hash: token,
          expires_at: expect.any(Date),
          revoked_at: null,
        }),
      });
    });
  });
  describe('findAll', () => {
    it('should return all refresh tokens', async () => {
      const mockTokens = [
        {
          id: 1,
          user_id: 1,
          token_hash: 'token-1',
          expires_at: new Date('2026-12-01'),
          revoked_at: null,
        },
        {
          id: 2,
          user_id: 2,
          token_hash: 'token-2',
          expires_at: new Date('2026-12-05'),
          revoked_at: null,
        },
      ];

      prisma.refresh_token.findMany.mockResolvedValue(mockTokens);

      await expect(service.findAll()).resolves.toEqual(mockTokens);

      expect(prisma.refresh_token.findMany).toHaveBeenCalledWith();
    });
  });
  describe('findOne', () => {
    it('should return a refresh token by ID', async () => {
      const mockToken = {
        id: 1,
        user_id: 1,
        token_hash: 'token-123',
        expires_at: new Date('2026-12-01'),
        revoked_at: null,
      };

      prisma.refresh_token.findUnique.mockResolvedValue(mockToken);

      await expect(service.findOne(1)).resolves.toEqual(mockToken);

      expect(prisma.refresh_token.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when the token does not exist', async () => {
      prisma.refresh_token.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).resolves.toBeNull();

      expect(prisma.refresh_token.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
  describe('findOneFromToken', () => {
    it('should return a refresh token by token hash', async () => {
      const mockToken = {
        id: 1,
        user_id: 1,
        token_hash: 'hashed-token-123',
        expires_at: new Date('2026-12-01'),
        revoked_at: null,
      };

      prisma.refresh_token.findUnique.mockResolvedValue(mockToken);

      await expect(
        service.findOneFromToken('hashed-token-123'),
      ).resolves.toEqual(mockToken);

      expect(prisma.refresh_token.findUnique).toHaveBeenCalledWith({
        where: { token_hash: 'hashed-token-123' },
      });
    });

    it('should return null when the token hash does not exist', async () => {
      prisma.refresh_token.findUnique.mockResolvedValue(null);

      await expect(
        service.findOneFromToken('unknown-token'),
      ).resolves.toBeNull();

      expect(prisma.refresh_token.findUnique).toHaveBeenCalledWith({
        where: { token_hash: 'unknown-token' },
      });
    });
  });
  describe('findAllOfUserToken', () => {
    it('should return all refresh tokens belonging to a user', async () => {
      const mockTokens = [
        {
          id: 1,
          user_id: 1,
          token_hash: 'token-1',
          expires_at: new Date('2026-12-01'),
          revoked_at: null,
        },
        {
          id: 2,
          user_id: 1,
          token_hash: 'token-2',
          expires_at: new Date('2026-12-05'),
          revoked_at: null,
        },
      ];

      prisma.refresh_token.findMany.mockResolvedValue(mockTokens);

      await expect(service.findAllOfUserToken(1)).resolves.toEqual(mockTokens);

      expect(prisma.refresh_token.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });

    it('should return an empty array when the user has no tokens', async () => {
      prisma.refresh_token.findMany.mockResolvedValue([]);

      await expect(service.findAllOfUserToken(999)).resolves.toEqual([]);

      expect(prisma.refresh_token.findMany).toHaveBeenCalledWith({
        where: { user_id: 999 },
      });
    });
  });
  describe('update', () => {
      it('should update a refresh token successfully', async () => {
        const updateDto = {
          tokenHash: 'updated-token',
        };

        const mockUpdatedToken = {
          id: 1,
          user_id: 1,
          token_hash: 'updated-token',
          expires_at: new Date('2026-12-01'),
          revoked_at: null,
        };

        prisma.refresh_token.update.mockResolvedValue(mockUpdatedToken);

        await expect(
          service.update(1, updateDto),
        ).resolves.toEqual(mockUpdatedToken);

       expect(prisma.refresh_token.update).toHaveBeenCalledWith({
              where: { id: 1 },
              data: {
              token_hash: 'updated-token',
          },
        });
      });
    });
    describe('remove', () => {
    it('should delete a refresh token by ID', async () => {
      const mockDeletedToken = {
        id: 1,
        user_id: 1,
        token_hash: 'token-123',
        expires_at: new Date('2026-12-01'),
        revoked_at: null,
      };

      prisma.refresh_token.delete.mockResolvedValue(mockDeletedToken);

      await expect(service.remove(1)).resolves.toEqual(mockDeletedToken);

      expect(prisma.refresh_token.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
  describe('removeThatHashed', () => {
    it('should delete a refresh token by its hash', async () => {
      const mockDeletedToken = {
        id: 1,
        user_id: 1,
        token_hash: 'hashed-token-123',
        expires_at: new Date('2026-12-01'),
        revoked_at: null,
      };

      prisma.refresh_token.delete.mockResolvedValue(mockDeletedToken);

      await expect(
        service.removeThatHashed('hashed-token-123'),
      ).resolves.toEqual(mockDeletedToken);

      expect(prisma.refresh_token.delete).toHaveBeenCalledWith({
        where: { token_hash: 'hashed-token-123' },
      });
    });
  });
  describe('DeleteIfTokensExpired', () => {
    it('should delete expired tokens belonging to a user', async () => {
      const mockDeleteResult = {
        count: 2,
      };

      prisma.refresh_token.deleteMany.mockResolvedValue(mockDeleteResult);

      await expect(
        service.DeleteIfTokensExpired(1),
      ).resolves.toEqual(mockDeleteResult);

      expect(prisma.refresh_token.deleteMany).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          expires_at: {
            lte: expect.any(Date),
          },
        },
      });
    });

    it('should return count 0 when no expired tokens exist', async () => {
      prisma.refresh_token.deleteMany.mockResolvedValue({ count: 0 });

      await expect(
        service.DeleteIfTokensExpired(1),
      ).resolves.toEqual({ count: 0 });
    });
  });
});

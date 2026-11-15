
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { user_role } from '@prisma/client';
import { RolesGuard } from './role-auth.guard';
import { PUBLIC_KEY, ROLES_KEY } from '../roles/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: { role: user_role.USER },
      }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    mockReflector.getAllAndOverride.mockImplementation((key) => {
      if (key === ROLES_KEY) return undefined;
      return false;
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should allow access to a public route', () => {
    mockReflector.getAllAndOverride.mockImplementation((key) => {
      if (key === ROLES_KEY) return [user_role.ADMIN];
      if (key === PUBLIC_KEY) return true;
      return undefined;
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should allow access when the user has the required role', () => {
    mockReflector.getAllAndOverride.mockImplementation((key) => {
      if (key === ROLES_KEY) return [user_role.USER];
      if (key === PUBLIC_KEY) return false;
      return undefined;
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should deny access when the user does not have the required role', () => {
    mockReflector.getAllAndOverride.mockImplementation((key) => {
      if (key === ROLES_KEY) return [user_role.ADMIN];
      if (key === PUBLIC_KEY) return false;
      return undefined;
    });

    expect(guard.canActivate(mockContext)).toBe(false);
  });
});

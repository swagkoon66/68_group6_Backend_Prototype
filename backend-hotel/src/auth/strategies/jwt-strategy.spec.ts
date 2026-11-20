jest.mock('@nestjs/passport', () => ({
  PassportStrategy: () => {
    return class MockPassportStrategy {
      constructor(..._args: any[]) {}
    };
  },
}));

import { JwtStrategy } from './jwt-strategy';
import { user_role } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate JWT payload and return user information', async () => {
    const payload = {
      user_id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: user_role.USER,
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: user_role.USER,
    });
  });
});

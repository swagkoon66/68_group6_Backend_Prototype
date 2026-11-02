import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('RefreshTokenService');

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    this.logger.log(`Creating a token for user: ${createRefreshTokenDto.userId}`);
    try {
      return await this.prisma.refresh_token.create({
        data: {
          user_id: createRefreshTokenDto.userId,
          token_hash: createRefreshTokenDto.tokenHash,
          expires_at: createRefreshTokenDto.expiresAt,
          revoked_at: createRefreshTokenDto.revokedAt,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid refresh-token1 data provided");
    }
  }

  async createLogin(userId: number, token: string) {
    this.logger.log(`Creating a token for user: ${userId}`);
    try {
      return await this.prisma.refresh_token.create({
        data: {
          user_id: userId,
          token_hash: token,
          expires_at: new Date(Date.now() + 60 * 60 * 1000), // 60 minutes
          revoked_at: new Date(Date.now()),
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid refresh-token2 data provided");
    }
  }

  async findAll() {
    this.logger.log(`This action returns all refreshToken`);
    return await this.prisma.refresh_token.findMany();
  }

  async findOne(id: number) {
    this.logger.log(`This action returns a #${id} refreshToken`);
    return await this.prisma.refresh_token.findUnique({ where: { id } });
  }

  async findOneFromToken(token: string) {
    this.logger.log(`This action returns a refreshToken that has ${token}`);
    return await this.prisma.refresh_token.findUnique({ where: { token_hash: token } });
  }

  async findAllOfUserToken(userId: number) {
    this.logger.log(`This action returns all of user ${userId}'s refreshToken`);
    return await this.prisma.refresh_token.findMany({ where: { user_id: userId } })
  }

  async update(id: number, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    this.logger.log(`This action updates a #${id} refreshToken`);
    return await this.prisma.refresh_token.update({ where: { id }, data: { ...updateRefreshTokenDto } });
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} refreshToken`);
    return await this.prisma.refresh_token.delete({ where: { id } });
  }

  async removeThatHashed(token: string) {
    this.logger.log(`This action removes a #${token} refreshToken`);
    return await this.prisma.refresh_token.delete({ where: { token_hash: token } });
  }

  async DeleteIfTokensExpired(user_id: number) {
    return await this.prisma.refresh_token.deleteMany({ where: { user_id: user_id, expires_at: { lte: new Date() } } })
  }
}

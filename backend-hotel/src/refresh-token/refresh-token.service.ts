import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('RefreshTokenService');

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    this.logger.log(`Creating a token ${createRefreshTokenDto.id}`);
    try {
      return await this.prisma.refresh_token.create({
        data: {
          id: createRefreshTokenDto.id,
          user_id: createRefreshTokenDto.userId,
          token_hash: createRefreshTokenDto.tokenHash,
          expires_at: createRefreshTokenDto.expiresAt,
          revoked_at: createRefreshTokenDto.revokedAt,
        }
      });
    } catch (e: any) {
        this.logger.error("Invalid refresh-token data provided");
    }
  }

  findAll() {
    return `This action returns all refreshToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refreshToken`;
  }

  update(id: number, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return `This action updates a #${id} refreshToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} refreshToken`;
  }
}

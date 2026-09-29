import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, /* need prismaService to connect */ PrismaService],
})
export class RefreshTokenModule {}

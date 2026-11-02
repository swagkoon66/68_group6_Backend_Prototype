import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, PrismaService],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule { }

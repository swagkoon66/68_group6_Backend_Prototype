import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, /* need prismaService to connect */ PrismaService],
  exports: [UserService]
})
export class UserModule {}

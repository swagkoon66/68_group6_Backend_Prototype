import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { NotificationModule } from './notification/notification.module';
import { RoomImageModule } from './room-image/room-image.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    RoomModule, 
    BookingModule, 
    NotificationModule, 
    RefreshTokenModule, 
    RoomImageModule, 
    UserModule, 
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisStore = createKeyv('redis://127.0.0.1:6379');
        redisStore.on('error', (err) => console.error('Redis error:', err));
        return {
          stores: [redisStore],
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

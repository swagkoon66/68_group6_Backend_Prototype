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
        if (process.env.NODE_ENV === 'test') {
          return { ttl: 5000 };
        }
        const redisUrl =
          process.env.REDIS_URL ||
          (process.env.REDIS_HOST
            ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? 6379}`
            : 'redis://127.0.0.1:6379');
        const redisStore = createKeyv(redisUrl);
        redisStore.on('error', (err) => console.error('Redis error:', err));
        return { stores: [redisStore] };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

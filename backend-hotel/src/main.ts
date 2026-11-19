
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Hotel Management System API')
    .setDescription(
      [
        'REST API for the Hotel Management System.',
        '',
        'This API supports user authentication, room management,',
        'booking management, notifications, and refresh-token management.',
        '',
        'Authentication:',
        '- Protected endpoints require a JWT access token.',
        '- Select Authorize and enter your access token in Swagger UI.',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .addTag('app', 'Application status and health')
    .addTag('auth', 'User registration and authentication')
    .addTag('room', 'Hotel room management')
    .addTag('booking', 'Hotel booking management')
    .addTag('notification', 'Notification management')
    .addTag('user', 'User management')
    .addTag('refresh-token', 'Refresh token management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

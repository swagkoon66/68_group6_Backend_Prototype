
import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check whether the backend is running' })
  @ApiOkResponse({
    description: 'Backend welcome message returned successfully.',
    schema: {
      type: 'string',
      example: 'Hello World! The backend project is up and running',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check backend health status' })
  @ApiOkResponse({
    description: 'Backend health information returned successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: {
          type: 'string',
          example: 'NestJS is up and running!',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2026-11-19T13:00:00.000Z',
        },
      },
    },
  })
  getHealth(): { status: string; message: string; timestamp: string } {
    return this.appService.getHealth();
  }
}

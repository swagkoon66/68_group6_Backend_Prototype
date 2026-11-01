import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Start Running')
    return 'Hello World!';
  }

  getHealth(): {status: string, message: string, timestamp: string} {
    return {
      "status": 'ok',
      "message": 'NestJS is up and running!',
      "timestamp": new Date().toISOString()
    };
  }
}

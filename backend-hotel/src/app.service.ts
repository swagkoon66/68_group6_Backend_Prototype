import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Start Running')
    return 'Hello World!';
  }
}

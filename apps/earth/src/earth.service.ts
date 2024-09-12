import { Injectable } from '@nestjs/common';

@Injectable()
export class EarthService {
  getHello(): string {
    return 'Hello World!';
  }
}

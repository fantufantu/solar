import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import type { GetConfigInput } from 'typings/micro-service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getConfig<T>(input: GetConfigInput) {
    return this.configService.get<T>(`${input.token}.${input.property}`);
  }
}

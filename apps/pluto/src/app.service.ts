// nest
import { Injectable } from '@nestjs/common';
// project
import { ConfigService } from './config/config.service';
import type { GetConfigInput } from 'typings/micro-service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(input: GetConfigInput) {
    return this.configService.get(`${input.token}.${input.property}`);
  }
}

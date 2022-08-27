// nest
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// project
import { ConfigService } from './config.service';
import { PlutoServiceCmd } from 'assets/enums';
import { GetConfigInput } from 'typings/micro-service';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({ cmd: PlutoServiceCmd.GetConfig })
  get({ token, property }: GetConfigInput) {
    return this.configService.get(`${token}.${property}`);
  }
}

// nest
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// project
import { AppService } from './app.service';
import { CommandToken } from 'assets/tokens';
import type { GetConfigInput } from 'typings/micro-service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: CommandToken.GetConfig })
  getConfig(input: GetConfigInput) {
    return this.appService.getConfig(input);
  }
}

// nest
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetConfigInput } from 'typings/micro-service';
// project
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'sum' })
  getConfig(input: GetConfigInput) {
    return this.appService.getConfig(input);
  }
}

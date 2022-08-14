// nest
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// project
import { ConfigService } from './config.service';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({ cmd: 'config.get' })
  get(propertyPath: string) {
    return this.configService.get(propertyPath);
  }
}

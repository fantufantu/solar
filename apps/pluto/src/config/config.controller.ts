// nest
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// project
import { ConfigService } from './config.service';
import { PlutoServiceCMD } from 'assets/enums';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({ cmd: PlutoServiceCMD.GetConfig })
  get(propertyPath: string) {
    return this.configService.get(propertyPath);
  }
}

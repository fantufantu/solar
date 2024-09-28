import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandToken } from 'assets/tokens';
import type { GetConfigurationBy } from 'typings/micro-service';
import { ConfigurationService } from './configuration.service';

@Controller()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @MessagePattern({ cmd: CommandToken.GetConfiguration })
  getConfiguration<T>(getBy: GetConfigurationBy) {
    return this.configurationService.get<T>(getBy);
  }
}

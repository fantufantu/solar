import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { COMMAND_TOKENS } from 'constants/common.constant';
import type { GetConfigurationBy } from 'typings/micro-service';
import { ConfigurationService } from './configuration.service';

@Controller()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @MessagePattern({ cmd: COMMAND_TOKENS.GET_CONFIGURATION })
  getConfiguration<T>(getBy: GetConfigurationBy) {
    return this.configurationService.get<T>(getBy);
  }

  @MessagePattern({ cmd: COMMAND_TOKENS.GET_CONFIGURATIONS })
  getConfigurations<T extends unknown[]>(tokens: GetConfigurationBy[]) {
    return this.configurationService.list<T>(tokens);
  }
}

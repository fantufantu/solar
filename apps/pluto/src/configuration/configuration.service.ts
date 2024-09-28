import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetConfigurationBy } from 'typings/micro-service';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @description
   * 获取配置
   */
  get<T>({ token, property }: GetConfigurationBy) {
    return this.configService.get<T>([token, property].join('.'));
  }
}

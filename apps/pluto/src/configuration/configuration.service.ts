import { PartialTuple } from '@aiszlab/relax/types';
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

  /**
   * @description
   * 获取配置列表
   */
  list<T extends unknown[]>(tokens: GetConfigurationBy[]) {
    return tokens.map((getBy) => this.get(getBy)) as unknown as PartialTuple<T>;
  }
}

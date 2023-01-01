// nest
import { Injectable } from '@nestjs/common';
import { ConfigService as NativeConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nativeConfigService: NativeConfigService) {}

  /**
   * 获取配置项对应的值
   * @param propertyPath string
   * @returns any
   */
  get(propertyPath: string) {
    return this.nativeConfigService.get(propertyPath);
  }
}

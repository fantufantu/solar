// nest
import { Injectable } from '@nestjs/common';
import { ConfigService as NativeConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nativeConfigService: NativeConfigService) {}

  /**
   * 获取配置
   */
  get<T>(propertyPath: string) {
    return this.nativeConfigService.get<T>(propertyPath);
  }
}

// nest
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MercuryConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取微服务监听端口
   */
  getServicePort() {
    return this.configService.get<number>('service.port');
  }
}

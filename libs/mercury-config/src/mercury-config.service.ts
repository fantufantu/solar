// nest
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class MercuryConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取微服务监听端口
   */
  getServicePort() {
    return this.configService.get<number>('service.port');
  }

  /**
   * 获取微服务对应的通讯方式
   */
  getServiceTransport(): Transport.TCP {
    return Transport.TCP;
  }
}

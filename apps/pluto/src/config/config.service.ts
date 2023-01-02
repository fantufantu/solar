// nest
import { Injectable } from '@nestjs/common';
import { ConfigService as NativeConfigService } from '@nestjs/config';
// project
import {
  ConfigRegisterToken,
  JwtPropertyToken,
  RsaPropertyToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';

@Injectable()
export class ConfigService {
  constructor(private readonly nativeConfigService: NativeConfigService) {}

  /**
   * 获取 jwt secret
   */
  getJwtSecret() {
    return this.nativeConfigService.get<string>(
      `${ConfigRegisterToken.Jwt}.${JwtPropertyToken.Secret}`,
    );
  }

  /**
   * 获取 rsa privateKey
   */
  getRsaPrivateKey() {
    return this.nativeConfigService.get<string>(
      `${ConfigRegisterToken.Rsa}.${RsaPropertyToken.PrivateKey}`,
    );
  }

  /**
   * 获取 腾讯云 secret id
   */
  getTencentCloudSecretId() {
    return this.nativeConfigService.get<string>(
      `${ConfigRegisterToken.TencentCloud}.${TencentCloudPropertyToken.SecretId}`,
    );
  }

  /**
   * 获取 腾讯云 secret key
   */
  getTencentCloudSecretKey() {
    return this.nativeConfigService.get<string>(
      `${ConfigRegisterToken.TencentCloud}.${TencentCloudPropertyToken.SecretKey}`,
    );
  }

  /**
   * 通用获取配置
   */
  get<T>(propertyPath: string) {
    return this.nativeConfigService.get<T>(propertyPath);
  }
}

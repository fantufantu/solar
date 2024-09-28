import type {
  CommandToken,
  ConfigRegisterToken,
  TencentCloudPropertyToken,
  JwtPropertyToken,
  RsaPropertyToken,
} from 'assets/tokens';

/**
 * 微服务指令
 */
export interface Pattern {
  cmd: CommandToken;
}

/**
 * 获取环境配置的入参
 */
export type GetConfigurationBy =
  | {
      token: ConfigRegisterToken.TencentCloud;
      property: TencentCloudPropertyToken;
    }
  | {
      token: ConfigRegisterToken.Jwt;
      property: JwtPropertyToken;
    }
  | {
      token: ConfigRegisterToken.Rsa;
      property: RsaPropertyToken;
    };

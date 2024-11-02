import type {
  CommandToken,
  ConfigurationRegisterToken,
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
      token: ConfigurationRegisterToken.TencentCloud;
      property: TencentCloudPropertyToken;
    }
  | {
      token: ConfigurationRegisterToken.Jwt;
      property: JwtPropertyToken;
    }
  | {
      token: ConfigurationRegisterToken.Rsa;
      property: RsaPropertyToken;
    }
  | {
      token: ConfigurationRegisterToken.Openai;
      property: string;
    };

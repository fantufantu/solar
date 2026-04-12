import type {
  CommandToken,
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
  JwtPropertyToken,
  RsaPropertyToken,
} from 'assets/tokens';
import { type REGISTERED_CONFIGURATION_TOKENS } from '../constants/configuration';
import { VolcArkPropertyToken } from 'constants/volc-ark';

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
      token: typeof REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD;
      property: TencentCloudPropertyToken;
    }
  | {
      token: typeof REGISTERED_CONFIGURATION_TOKENS.JWT_CONFIG;
      property: JwtPropertyToken;
    }
  | {
      token: typeof REGISTERED_CONFIGURATION_TOKENS.RSA_CONFIG_CONFIG;
      property: RsaPropertyToken;
    }
  | {
      token: typeof REGISTERED_CONFIGURATION_TOKENS.OPENAI_CONFIG;
      property: string;
    }
  | {
      token: typeof REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK;
      property: VolcArkPropertyToken;
    };

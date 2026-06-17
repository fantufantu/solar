import { COMMAND_TOKENS } from 'constants/common.constant';
import type {
  TencentCloudPropertyToken,
  JwtPropertyToken,
  RsaPropertyToken,
} from 'constants/common.constant';
import { type REGISTERED_CONFIGURATION_TOKENS } from '../constants/configuration';
import { VolcArkPropertyToken } from 'constants/volc-ark.constant';

/**
 * 微服务指令
 */
export interface Pattern {
  cmd: (typeof COMMAND_TOKENS)[keyof typeof COMMAND_TOKENS];
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

/**
 * 获取用户信息入参
 */
export interface GetUserBy {
  id?: number;
  username?: string;
}

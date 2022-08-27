// project
import type {
  AppServiceIdentity,
  ConfigJwtProperty,
  ConfigRegisterToken,
  ConfigRsaProperty,
  ConfigTencentCloudProperty,
  PlutoServiceCmd,
} from 'assets/enums';

/**
 * ts声明：微服务运行指令
 */
export interface Pattern {
  cmd: PlutoServiceCmd;
}

export type GetConfigInput =
  | {
      token: ConfigRegisterToken.TencentCloud;
      property: ConfigTencentCloudProperty;
    }
  | {
      token: ConfigRegisterToken.Jwt;
      property: ConfigJwtProperty;
    }
  | {
      token: ConfigRegisterToken.Port;
      property: AppServiceIdentity;
    }
  | {
      token: ConfigRegisterToken.Rsa;
      property: ConfigRsaProperty;
    };

/**
 * 类型控制
 */
export type SendInput<P extends Pattern> = P extends {
  cmd: PlutoServiceCmd.GetConfig;
}
  ? GetConfigInput
  : never;

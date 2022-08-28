/**
 * 应用服务枚举
 */
export enum AppServiceIdentity {
  Mercury = 'mercury',
  Earth = 'earth',
}

/**
 * 自定义的 provider token
 * 增加自定义前缀，避免冲突
 */
export enum CustomProviderToken {
  PlutoClientProxy = 'CustomPlutoClientProxy',
  MercuryClientProxy = 'CustomMercuryClientProxy',
  JwtSecretService = 'CustomJwtSecretService',
}

/**
 * pluto 服务 cmd
 */
export enum PlutoServiceCmd {
  GetConfig = 'config.get',
}

/**
 * Mercury 服务 cmd
 */
export enum MercuryServiceCmd {
  GetUser = 'user.get',
  Permit = 'role.permit',
}

/**
 * 自定义的插件 token
 */
export enum CustomMetadataKey {
  Permission = 'permission',
}

export { RegisterToken as ConfigRegisterToken } from './config';
export { Property as ConfigTencentCloudProperty } from './config/tencent-cloud';
export { Property as ConfigJwtProperty } from './config/jwt';
export { Property as ConfigRsaProperty } from './config/rsa';

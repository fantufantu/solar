/**
 * 应用服务枚举
 */
export enum ApplicationToken {
  Mercury = 'mercury',
  Venus = 'venus',
  Earth = 'earth',
}

/**
 * 自定义的 provider token
 */
export enum ProviderToken {
  PlutoClientProxy = 'PlutoClientProxy',
  MercuryClientProxy = 'MercuryClientProxy',
  JwtSecret = 'JwtSecret',
}

/**
 * 自定义的插件 token
 */
export enum MetadataToken {
  Permission = 'permission',
}

/**
 * @description
 * config 注册值
 */
export enum ConfigurationRegisterToken {
  TencentCloud = 'tencent-cloud',
  Jwt = 'jwt',
  Rsa = 'rsa',
}

/**
 * tencent cloud 属性
 */
export enum TencentCloudPropertyToken {
  SecretId = 'secretId',
  SecretKey = 'secretKey',

  Bucket = 'bucket',
  BucketRegion = 'bucket-region',

  SesRegion = 'ses-region',
}

/**
 * rsa 属性
 */
export enum RsaPropertyToken {
  PublicKey = 'publicKey',
  PrivateKey = 'privateKey',
}

/**
 * jwt 属性
 */
export enum JwtPropertyToken {
  Secret = 'secret',
}

/**
 * @description
 * 服务 cmd
 */
export enum CommandToken {
  GetConfiguration = 'configuration.get',
  GetUser = 'user.get',
  Permit = 'role.permit',
  isLoggedIn = 'authentication.logged-in',
}

/**
 * GraphQL enum tokne
 */
export enum GraphQLEnumToken {
  // authorization
  AuthorizationActionCode = 'AuthorizationActionCode',
  AuthorizationResourceCode = 'AuthorizationResourceCode',

  // venus
  TransactionDirection = 'TransactionDirection',
  SharingTargetType = 'SharingTargetType',
  BillingLimitDuration = 'BillingLimitDuration',
}

/**
 * @description
 * cache token
 * 主要用于前缀，在 solar 中，cache key 主要依赖 prefix/value
 */
export enum CacheToken {
  // 认证令牌
  Authenticated = 'authenticated',
  // 验证码
  Captcha = 'captcha',
}

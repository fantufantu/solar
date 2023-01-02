/**
 * 应用服务枚举
 */
export enum ApplicationToken {
  Mercury = 'mercury',
  Earth = 'earth',
}

/**
 * 自定义的 provider token
 */
export enum ProviderToken {
  PlutoClientProxy = 'PlutoClientProxy',
  MercuryClientProxy = 'MercuryClientProxy',
  JwtSecretService = 'JwtSecretService',
}

/**
 * 自定义的插件 token
 */
export enum MetadataToken {
  Permission = 'permission',
}

/**
 * config 注册值
 */
export enum ConfigRegisterToken {
  TencentCloud = 'tencentCloud',
  Jwt = 'jwt',
  Rsa = 'rsa',
}

/**
 * tencent cloud 属性
 */
export enum TencentCloudPropertyToken {
  Bucket = 'bucket',
  Region = 'region',
  SecretId = 'secretId',
  SecretKey = 'secretKey',
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
 * 服务 cmd
 */
export enum CommandToken {
  GetConfig = 'config.get',
  GetUser = 'user.get',
  Permit = 'role.permit',
}

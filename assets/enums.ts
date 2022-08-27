/**
 * 应用服务枚举
 */
export enum AppServiceIdentity {
  Mercury = 'mercury',
  Earth = 'earth',
}

// /**
//  * 微服务客户端枚举
//  */
// export enum MicroServiceClientIdentity {
//   Pluto = 'pluto-client',
//   Mercury = 'mercury-client',
// }

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
export enum PlutoServiceCMD {
  GetConfig = 'config.get',
}

/**
 * Mercury 服务 cmd
 */
export enum MercuryServiceCMD {
  GetUser = 'user.get',
}

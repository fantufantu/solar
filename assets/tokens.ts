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
 * 服务 cmd
 */
export enum CommandToken {
  GetJwtSecret = 'jwt.secret',
  GetUser = 'user.get',
  Permit = 'role.permit',
}

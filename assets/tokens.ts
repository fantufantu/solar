/**
 * @description
 * rsa 属性
 */
export enum RsaPropertyToken {
  PublicKey = 'public-key',
  PrivateKey = 'private-key',
}

/**
 * @description
 * jwt 属性
 */
export enum JwtPropertyToken {
  Secret = 'secret',
}

/**
 * 数据库配置
 */
export enum DatabasePropertyToken {
  password = 'password',
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

  // cos
  BucketName = 'BucketName',
}


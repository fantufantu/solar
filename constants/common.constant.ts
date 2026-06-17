import type { ValueOf } from '@aiszlab/relax/types';

/**
 * 系统中内置的标识符
 */
export const SYSTEM_WILDCARD = {
  // 间隔。常用于内部拼接关键字使用
  SEPARATOR: '::' as const,
} as const;

/**
 * 自定义的插件 token
 */
export const METADATA_TOKEN = {
  AUTHORIZATION: 'authorization',
} as const;

/**
 * 微服务命令令牌
 */
export const COMMAND_TOKENS = {
  GET_CONFIGURATION: 'configuration.get',
  GET_CONFIGURATIONS: 'configurations.get',
  GET_USER: 'user.get',
  AUTHORIZE: 'role.authorize',
  IS_LOGGED_IN: 'authentication.logged-in',
} as const;

/**
 * @description
 * rsa 属性
 */
export const RSA_PROPERTY_TOKEN = {
  PUBLIC_KEY: 'public-key',
  PRIVATE_KEY: 'private-key',
} as const;

export type RsaPropertyToken = ValueOf<typeof RSA_PROPERTY_TOKEN>;

/**
 * @description
 * jwt 属性
 */
export const JWT_PROPERTY_TOKEN = {
  SECRET: 'secret',
} as const;

export type JwtPropertyToken = ValueOf<typeof JWT_PROPERTY_TOKEN>;

/**
 * 数据库配置
 */
export const DATABASE_PROPERTY_TOKEN = {
  PASSWORD: 'password',
} as const;

export type DatabasePropertyToken = ValueOf<typeof DATABASE_PROPERTY_TOKEN>;

/**
 * GraphQL enum token
 */
export const GRAPHQL_ENUM_TOKEN = {
  // authorization
  AUTHORIZATION_ACTION_CODE: 'AuthorizationActionCode',
  AUTHORIZATION_RESOURCE_CODE: 'AuthorizationResourceCode',

  // venus
  TRANSACTION_DIRECTION: 'TransactionDirection',
  SHARING_TARGET_TYPE: 'SharingTargetType',
  BILLING_LIMIT_DURATION: 'BillingLimitDuration',

  // cos
  BUCKET_NAME: 'BucketName',
} as const;

export type GraphQLEnumToken = ValueOf<typeof GRAPHQL_ENUM_TOKEN>;

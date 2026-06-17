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

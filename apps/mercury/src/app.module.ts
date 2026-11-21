import { Module } from '@nestjs/common';
import { APPLICATION_TOKEN } from 'constants/app.constant';
import { DatabaseModule } from '@/libs/database';
import { PassportModule } from '@/libs/passport';
import { PlutoClientModule } from '@/libs/pluto-client';
import { AuthorizationModule } from './authorization/authorization.module.js';
import { RoleModule } from './role/role.module.js';
import { DictionaryModule } from './dictionary/dictionary.module.js';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module.js';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UserModule } from './user/user.module.js';
import { ConfigModule } from './config/config.module.js';
import { AuthenticationModule } from './authentication/authentication.module.js';
import { CacheModule } from '@/libs/cache';

@Module({
  imports: [
    CacheModule,
    // `pluto`微服务客户端
    PlutoClientModule,
    // API
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // 数据库
    DatabaseModule.forRoot(APPLICATION_TOKEN.MERCURY, {
      synchronize: false,
    }),
    // 认证
    PassportModule,
    // 凭证
    AuthenticationModule,
    // 权限
    AuthorizationModule,
    // 角色
    RoleModule,
    // 字典
    DictionaryModule,
    // 字典枚举
    DictionaryEnumModule,
    // 用户模块
    UserModule,
    // 配置模块
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

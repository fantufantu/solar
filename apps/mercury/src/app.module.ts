import { Module } from '@nestjs/common';
import { ApplicationToken } from 'assets/tokens';
import { DatabaseModule } from '@/libs/database';
import { PassportModule } from '@/libs/passport';
import { PlutoClientModule } from '@/libs/pluto-client';
import { AuthorizationModule } from './authorization/authorization.module';
import { RoleModule } from './role/role.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { CloudModule } from './cloud/cloud.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CacheModule } from '@/libs/cache';

@Module({
  imports: [
    CacheModule,
    // pluto 微服务客户端
    PlutoClientModule,
    // api
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Mercury),
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
    // 云服务模块
    CloudModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// nest
import { Module } from '@nestjs/common';
// project
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationToken } from 'assets/tokens';
import { DatabaseModule } from '@/lib/database';
import { PassportModule } from '@/lib/passport';
import { PlutoClientModule } from '@/lib/pluto-client';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
    // 用户权限
    AuthModule,
    // 菜单
    MenuModule,
    // 租户
    TenantModule,
    // 角色
    RoleModule,
    // 字典
    DictionaryModule,
    // 字典枚举
    DictionaryEnumModule,
    // 用户模块
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

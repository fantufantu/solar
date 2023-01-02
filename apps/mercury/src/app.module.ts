// nest
import { Module } from '@nestjs/common';
// project
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationToken } from 'assets/tokens';
// modules
import { GraphQLModule } from '@app/graphql';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@app/passport';
import { ConfigModule } from '../../pluto/src/config/config.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { MercuryClientModule } from '@app/mercury-client';

@Module({
  imports: [
    // 配置
    ConfigModule,
    // 微服务
    MercuryClientModule,
    // api
    GraphQLModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

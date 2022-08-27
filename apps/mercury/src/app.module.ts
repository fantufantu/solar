// nest
import { Module } from '@nestjs/common';
// project
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@app/graphql';
import { PlutoClientModule } from '@app/pluto-client';
import { DatabaseModule } from '@app/database';
import { AppServiceIdentity } from 'assets/enums';
import { MercuryConfigModule } from '@app/mercury-config';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { PassportModule } from '@app/passport';

@Module({
  imports: [
    // 微服务pluto客户端
    PlutoClientModule,
    // 微服务mercury服务端
    MercuryConfigModule,
    // GraphQL 模块
    GraphQLModule,
    // 数据库模块
    DatabaseModule.forRoot(AppServiceIdentity.Mercury),
    // 认证模块
    PassportModule,
    // 业务模块
    AuthModule,
    TenantModule,
    MenuModule,
    RoleModule,
    DictionaryModule,
    DictionaryEnumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

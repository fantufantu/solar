import { Module } from '@nestjs/common';
import { TouristPlanModule } from './tourist-guide/tourist-plan.module';
import { PlutoClientModule } from '@/libs/pluto-client';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DatabaseModule } from '@/libs/database';
import { ApplicationToken } from 'assets/tokens';

@Module({
  imports: [
    // 配置微服务客户端
    PlutoClientModule,

    // API
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),

    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Mercury, {
      synchronize: true,
    }),

    TouristPlanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

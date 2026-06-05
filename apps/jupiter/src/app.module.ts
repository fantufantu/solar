import { Module } from '@nestjs/common';
import { TouristPlanModule } from './tourist-guide/tourist-plan.module';
import { MembershipModule } from './membership/membership.module';
import { CityModule } from './city/city.module';
import { AttractionModule } from './attraction/attraction.module';
import { PlutoClientModule } from '@/libs/pluto-client';
import { MercuryClientModule } from '@/libs/mercury-client';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DatabaseModule } from '@/libs/database';
import { ApplicationToken } from 'assets/tokens';
import { User } from '@/libs/database/entities/jupiter/user.entity';

@Module({
  imports: [
    // 配置微服务客户端
    PlutoClientModule,

    // 基建微服务客户端
    MercuryClientModule,

    // API
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),

    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Jupiter, {
      synchronize: false,
    }),

    // 出行计划模块
    TouristPlanModule,

    // 会员等级模块
    MembershipModule,

    // 城市模块
    CityModule,

    // 景区模块
    AttractionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

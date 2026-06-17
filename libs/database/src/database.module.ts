import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
import type { ApplicationToken } from 'constants/app.constant';
import { PlutoClientModule, PlutoClientService } from '@/libs/pluto-client';
import { TENCENT_CLOUD_CONFIGURATION } from 'constants/cloud.constant';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration.constant';

@Module({
  providers: [PlutoClientModule],
})
export class DatabaseModule {
  static forRoot(
    database: ApplicationToken,
    { synchronize = false }: { synchronize?: boolean } = {},
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [PlutoClientModule],
          inject: [PlutoClientService],
          useFactory: async (client: PlutoClientService) => {
            const {
              0: host,
              1: port,
              2: password,
            } = await client.getConfigurations<[string, string, string]>([
              {
                token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
                property: TENCENT_CLOUD_CONFIGURATION.DATABASE_HOST,
              },
              {
                token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
                property: TENCENT_CLOUD_CONFIGURATION.DATABASE_PORT,
              },
              {
                token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
                property: TENCENT_CLOUD_CONFIGURATION.DATABASE_PASSWORD,
              },
            ]);

            return {
              type: 'mysql',
              host,
              port: +(port ?? ''),
              database,
              password,
              username: 'fantu',
              autoLoadEntities: true,
              // 应用启动不需要同步数据库结构
              synchronize,
            };
          },
        }),
      ],
      providers: [],
      exports: [],
    };
  }
}

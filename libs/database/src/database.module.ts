import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
import { ApplicationToken } from 'assets/tokens';
import { PlutoClientModule, PlutoClientService } from '@/libs/pluto-client';
import { TENCENT_CLOUD_CONFIGURATION } from 'constants/cloud';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

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
                property: TENCENT_CLOUD_CONFIGURATION.database_host,
              },
              {
                token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
                property: TENCENT_CLOUD_CONFIGURATION.database_port,
              },
              {
                token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
                property: TENCENT_CLOUD_CONFIGURATION.database_password,
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

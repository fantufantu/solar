import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
import { ApplicationToken } from 'assets/tokens';

@Module({})
export class DatabaseModule {
  static forRoot(database: ApplicationToken): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'sh-cdb-1xrcx35a.sql.tencentcdb.com',
          port: 28362,
          username: 'fantu',
          database,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
      providers: [],
      exports: [],
    };
  }
}

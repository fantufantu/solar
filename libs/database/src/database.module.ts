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
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
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

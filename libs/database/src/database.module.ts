// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
// project
import { DatabaseService } from './database.service';
import { ApplicationToken } from 'assets/tokens';

@Module({})
export class DatabaseModule {
  static forRoot(database: ApplicationToken): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          database,
          autoLoadEntities: true,
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}

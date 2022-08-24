// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
// project
import { DatabaseService } from './database.service';
import { AppServiceIdentity } from 'assets/enums';

@Module({})
export class DatabaseModule {
  static forRoot(identity: AppServiceIdentity): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          database: identity,
          autoLoadEntities: true,
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}

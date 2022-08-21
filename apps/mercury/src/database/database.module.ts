// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { AppServiceIdentity } from 'assets/enums';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: AppServiceIdentity.Mercury,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}

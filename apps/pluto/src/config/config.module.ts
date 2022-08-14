// nest
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
// project
import { jwtConfig } from './configurations';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      load: [jwtConfig],
    }),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}

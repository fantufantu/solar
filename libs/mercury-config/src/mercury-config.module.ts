// nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// project
import { MercuryConfigService } from './mercury-config.service';
import { serviceConfig } from './configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serviceConfig],
    }),
  ],
  providers: [MercuryConfigService],
  exports: [MercuryConfigService],
})
export class MercuryConfigModule {}

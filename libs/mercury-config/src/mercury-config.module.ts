// nest
import { Module } from '@nestjs/common';
// project
import { MercuryConfigService } from './mercury-config.service';

@Module({
  providers: [MercuryConfigService],
  exports: [MercuryConfigService],
})
export class MercuryConfigModule {}

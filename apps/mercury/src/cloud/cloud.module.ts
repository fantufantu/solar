import { Module } from '@nestjs/common';
import { CloudResolver } from './cloud.resolver';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';

@Module({
  imports: [],
  controllers: [CloudController],
  providers: [CloudResolver, CloudService],
})
export class CloudModule {}

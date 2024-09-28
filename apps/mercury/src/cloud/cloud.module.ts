import { Module } from '@nestjs/common';
import { CloudResolver } from './cloud.resolver';
import { CloudService } from './cloud.service';

@Module({
  imports: [],
  providers: [CloudResolver, CloudService],
})
export class CloudModule {}

import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareResolver } from './share.resolver';

@Module({
  providers: [ShareResolver, ShareService]
})
export class ShareModule {}

// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { ShareService } from './share.service';
import { ShareResolver } from './share.resolver';
import { Share } from './entities/share.entity';
import { ShareLoader } from './share.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Share])],
  providers: [ShareLoader, ShareService, ShareResolver],
  exports: [ShareService],
})
export class ShareModule {}

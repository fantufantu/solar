import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service.js';
import { CacheModule as _CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [_CacheModule.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

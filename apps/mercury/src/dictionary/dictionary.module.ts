// nest
import { Module } from '@nestjs/common';
// project
import { DictionaryService } from './dictionary.service';
import { DictionaryResolver } from './dictionary.resolver';

@Module({
  providers: [DictionaryResolver, DictionaryService],
})
export class DictionaryModule {}

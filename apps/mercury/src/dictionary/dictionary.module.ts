import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryService } from './dictionary.service.js';
import { DictionaryResolver } from './dictionary.resolver.js';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [DictionaryResolver, DictionaryService],
})
export class DictionaryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryService } from './dictionary.service';
import { DictionaryResolver } from './dictionary.resolver';
import { Dictionary } from '@/lib/database/entities/mercury/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [DictionaryResolver, DictionaryService],
})
export class DictionaryModule {}

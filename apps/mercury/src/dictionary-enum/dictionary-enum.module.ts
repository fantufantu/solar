import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryEnumService } from './dictionary-enum.service.js';
import { DictionaryEnumResolver } from './dictionary-enum.resolver.js';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEnum])],
  providers: [DictionaryEnumResolver, DictionaryEnumService],
})
export class DictionaryEnumModule {}

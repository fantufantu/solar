// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { DictionaryEnumService } from './dictionary-enum.service';
import { DictionaryEnumResolver } from './dictionary-enum.resolver';
import { DictionaryEnum } from './entities/dictionary-enum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEnum])],
  providers: [DictionaryEnumResolver, DictionaryEnumService],
})
export class DictionaryEnumModule {}

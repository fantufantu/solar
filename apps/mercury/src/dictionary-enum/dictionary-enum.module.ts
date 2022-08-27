import { Module } from '@nestjs/common';
import { DictionaryEnumService } from './dictionary-enum.service';
import { DictionaryEnumResolver } from './dictionary-enum.resolver';

@Module({
  providers: [DictionaryEnumResolver, DictionaryEnumService]
})
export class DictionaryEnumModule {}

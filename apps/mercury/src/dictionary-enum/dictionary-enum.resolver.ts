import { Resolver } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}
}

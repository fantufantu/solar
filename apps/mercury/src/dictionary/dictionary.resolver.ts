import { Resolver } from '@nestjs/graphql';
import { DictionaryService } from './dictionary.service';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}
}

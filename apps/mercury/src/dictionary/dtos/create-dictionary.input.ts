// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Dictionary } from '../entities/dictionary.entity';

@InputType()
export class CreateDictionaryInput extends PickType(
  Dictionary,
  ['code', 'description', 'sortBy'],
  InputType,
) {}

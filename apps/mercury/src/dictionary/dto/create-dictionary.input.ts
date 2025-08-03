import { InputType, PickType } from '@nestjs/graphql';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';

@InputType()
export class CreateDictionaryInput extends PickType(
  Dictionary,
  ['code', 'name', 'sortBy'],
  InputType,
) {}

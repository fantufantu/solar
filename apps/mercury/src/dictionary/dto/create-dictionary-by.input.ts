import { InputType, PickType } from '@nestjs/graphql';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';

@InputType()
export class CreateDictionaryBy extends PickType(
  Dictionary,
  ['code', 'description', 'sortBy'],
  InputType,
) {}

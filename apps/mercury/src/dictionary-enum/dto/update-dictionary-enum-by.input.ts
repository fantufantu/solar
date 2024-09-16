import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDictionaryEnumBy } from './create-dictionary-enum-by.input';

@InputType()
export class UpdateDictionaryEnumBy extends PartialType(
  CreateDictionaryEnumBy,
) {}

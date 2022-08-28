// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateDictionaryEnumInput } from './create-dictionary-enum.input';

@InputType()
export class UpdateDictionaryEnumInput extends PartialType(
  CreateDictionaryEnumInput,
) {}

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDictionaryEnumInput } from './create-dictionary-enum.input.js';

@InputType()
export class UpdateDictionaryEnumInput extends PartialType(
  CreateDictionaryEnumInput,
) {}

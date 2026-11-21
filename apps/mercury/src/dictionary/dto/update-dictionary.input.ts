import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDictionaryInput } from './create-dictionary.input.js';

@InputType()
export class UpdateDictionaryInput extends PartialType(CreateDictionaryInput) {}

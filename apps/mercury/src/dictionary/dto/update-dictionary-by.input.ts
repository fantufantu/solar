import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDictionaryBy } from './create-dictionary-by.input';

@InputType()
export class UpdateDictionaryBy extends PartialType(CreateDictionaryBy) {}

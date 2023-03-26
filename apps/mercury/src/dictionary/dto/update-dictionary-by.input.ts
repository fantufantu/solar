// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateDictionaryBy } from './create-dictionary-by.input';

@InputType()
export class UpdateDictionaryBy extends PartialType(CreateDictionaryBy) {}

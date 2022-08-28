// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateDictionaryInput } from './create-dictionary.input';

@InputType()
export class UpdateDictionaryInput extends PartialType(CreateDictionaryInput) {}

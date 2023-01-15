// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}

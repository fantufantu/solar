// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateCategoryBy } from './create-category-by.input';

@InputType()
export class UpdateCategoryBy extends PartialType(CreateCategoryBy) {}

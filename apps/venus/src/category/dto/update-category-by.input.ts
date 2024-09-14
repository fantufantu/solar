import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryBy } from './create-category-by.input';

@InputType()
export class UpdateCategoryBy extends PartialType(CreateCategoryBy) {}

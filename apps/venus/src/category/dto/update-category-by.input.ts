import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryBy } from './create-category-by.input';

@InputType('UpdateTransactionCategoryBy')
export class UpdateCategoryBy extends PartialType(CreateCategoryBy) {}

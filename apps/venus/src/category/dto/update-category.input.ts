import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTransactionCategoryInput } from './create-category.input.js';

@InputType()
export class UpdateTransactionCategoryInput extends PartialType(
  CreateTransactionCategoryInput,
) {}

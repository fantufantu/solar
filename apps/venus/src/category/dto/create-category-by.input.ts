import { InputType, PickType } from '@nestjs/graphql';
import { Category } from '@/libs/database/entities/venus/category.entity';

@InputType('CreateTransactionCategoryBy')
export class CreateCategoryBy extends PickType(
  Category,
  ['name', 'direction'],
  InputType,
) {}

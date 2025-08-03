import { InputType, PickType } from '@nestjs/graphql';
import { Category } from '@/libs/database/entities/venus/category.entity';

@InputType()
export class CreateTransactionCategoryInput extends PickType(
  Category,
  ['name', 'direction'],
  InputType,
) {}

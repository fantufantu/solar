import { InputType, PickType } from '@nestjs/graphql';
import { Category } from '@/lib/database/entities/venus/category.entity';

@InputType()
export class CreateCategoryBy extends PickType(
  Category,
  ['name', 'direction'],
  InputType,
) {}

// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Category } from '../entities/category.entity';

@InputType()
export class CreateCategoryBy extends PickType(
  Category,
  ['name', 'icon', 'direction'],
  InputType,
) {}

import { InputType, PickType } from '@nestjs/graphql';
import { Category } from '@/lib/database/entities/earth/category.entity';

/**
 * @description
 * 创建文章分类
 */
@InputType('CreateArticleCategoryBy')
export class CreateCategoryBy extends PickType(
  Category,
  ['code', 'name'],
  InputType,
) {}

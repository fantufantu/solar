import { InputType, PickType } from '@nestjs/graphql';
import { Category } from '@/libs/database/entities/earth/category.entity';

/**
 * @description
 * 创建文章分类
 */
@InputType()
export class CreateArticleCategoryInput extends PickType(
  Category,
  ['code', 'name', 'image'],
  InputType,
) {}

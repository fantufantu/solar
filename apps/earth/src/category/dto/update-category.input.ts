import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateArticleCategoryInput } from './create-category.input';

/**
 * @description 更新文章分类
 */
@InputType()
export class UpdateArticleCategoryInput extends PartialType(
  PickType(CreateArticleCategoryInput, ['name', 'image']),
) {}

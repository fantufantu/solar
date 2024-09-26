import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateCategoryBy } from './create-category-by.input';

/**
 * @description
 * 更新文章分类
 */
@InputType('UpdateArticleCategoryBy')
export class UpdateCategoryBy extends PartialType(CreateCategoryBy) {}

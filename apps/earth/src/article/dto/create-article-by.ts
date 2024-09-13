import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Article } from '../entities/article.entity';

/**
 * @description
 * 创建文章实体
 */
@InputType()
export class CreateArticleBy extends PickType(
  Article,
  ['title', 'content', 'cover'],
  InputType,
) {
  @Field(() => [Int], {
    description: '分类ID列表',
  })
  categoryIds: number[];
}

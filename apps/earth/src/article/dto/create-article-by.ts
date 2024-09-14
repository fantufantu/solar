import { Field, InputType, PickType } from '@nestjs/graphql';
import { Article } from '../entities/article.entity';

/**
 * @description
 * 创建文章
 */
@InputType()
export class CreateArticleBy extends PickType(
  Article,
  ['title', 'content', 'cover'],
  InputType,
) {
  @Field(() => [String], {
    description: '分类code列表',
  })
  categoryCodes: number[];
}

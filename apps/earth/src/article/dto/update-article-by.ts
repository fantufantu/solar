import { CreateArticleBy } from './create-article-by';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleBy) {}

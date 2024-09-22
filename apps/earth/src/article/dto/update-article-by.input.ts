import { CreateArticleBy } from './create-article-by.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleBy extends PartialType(CreateArticleBy) {}

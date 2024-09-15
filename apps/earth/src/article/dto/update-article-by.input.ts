import { CreateArticleBy } from './create-article-by.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleBy) {}

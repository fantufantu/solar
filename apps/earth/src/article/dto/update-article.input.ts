import { CreateArticleInput } from './create-article.input.js';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {}

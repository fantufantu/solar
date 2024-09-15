import { Paginated } from 'assets/dto/paginated.factory.js';
import { Article } from '../../../../../libs/database/src/entities/earth/article.entity.js';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedArticles extends Paginated(Article) {}

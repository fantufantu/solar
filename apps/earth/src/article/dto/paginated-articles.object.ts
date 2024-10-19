import { Paginated } from 'assets/dto/paginated.factory';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedArticles extends Paginated(Article) {}

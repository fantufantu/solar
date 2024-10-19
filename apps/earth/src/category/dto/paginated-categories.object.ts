import { Paginated } from 'assets/dto/paginated.factory';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}

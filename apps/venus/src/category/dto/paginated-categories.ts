import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Category } from '@/lib/database/entities/venus/category.entity';

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}

import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Category } from '@/libs/database/entities/venus/category.entity';

@ObjectType('PaginatedTransactionCategories')
export class PaginatedCategories extends Paginated(Category) {}

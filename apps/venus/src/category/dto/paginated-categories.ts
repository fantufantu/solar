// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Category } from '../entities/category.entity';

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}

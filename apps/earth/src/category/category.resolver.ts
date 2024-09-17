import { Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '@/lib/database/entities/earth/category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
}

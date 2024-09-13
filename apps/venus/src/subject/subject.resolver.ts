// nest
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
// project
import { SubjectService } from './subject.service';
import { Subject } from './entities/subject.entity';
import { CreateSubjectBy } from './dto/create-subject-by.input';
import { UpdateSubjectBy } from './dto/update-subject-by.input';
import { FilterSubjectBy } from './dto/filter-subject-by.input';
import { PaginateBy } from 'assets/dto';
import { Filter, Pagination } from 'assets/decorators';
import { PaginatedSubjects } from './dto/paginated-subjects';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Mutation(() => Subject, {
    description: '创建科目',
  })
  create(@Args('createBy') createBy: CreateSubjectBy) {
    return this.subjectService.create(createBy);
  }

  @Query(() => PaginatedSubjects, {
    name: 'categories',
    description: '分页查询科目',
  })
  @UseInterceptors(PaginatedInterceptor)
  getCategories(
    @Pagination() paginateBy: PaginateBy,
    @Filter() filterBy: FilterSubjectBy,
  ) {
    return this.subjectService.getCategories({
      paginateBy,
      filterBy,
    });
  }

  @Query(() => Subject, { name: 'subject', description: '查询单个科目' })
  getSubject(
    @Args('id', { type: () => Int, description: '科目id' }) id: number,
  ) {
    return this.subjectService.getSubject(id);
  }

  @Mutation(() => Boolean, {
    description: '更新科目',
  })
  updateSubject(
    @Args('id', {
      type: () => Int,
      description: '科目id',
    })
    id: number,
    @Args('updateBy', {
      description: '科目',
    })
    updateBy: UpdateSubjectBy,
  ) {
    return this.subjectService.update(id, updateBy);
  }

  @Mutation(() => Boolean, {
    description: '删除科目',
  })
  remove(@Args('id', { type: () => Int, description: '科目id' }) id: number) {
    return this.subjectService.remove(id);
  }
}

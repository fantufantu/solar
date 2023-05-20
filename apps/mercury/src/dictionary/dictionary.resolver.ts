// nest
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
// project
import { DictionaryService } from './dictionary.service';
import { Dictionary } from './entities/dictionary.entity';
import { Pagination, Permission } from 'assets/decorators';
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { PaginatedDictionaries } from './dto/paginated-dictionaries';
import { PaginateBy } from 'assets/dto';
import { CreateDictionaryBy } from './dto/create-dictionary-by.input';
import { UpdateDictionaryBy } from './dto/update-dictionary-by.input';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Create,
  })
  createDictionary(@Args('createBy') createBy: CreateDictionaryBy) {
    return this.dictionaryService.create(createBy);
  }

  @Query(() => PaginatedDictionaries, {
    name: 'dictionaries',
    description: '分页查询字典',
  })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaries(@Pagination() paginateBy: PaginateBy) {
    return this.dictionaryService.getDictionaries({
      paginateBy,
    });
  }

  @Query(() => Dictionary, { name: 'dictionary', description: '查询单个字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionay(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.getDictionay(id);
  }

  @Mutation(() => Boolean, { description: '更新字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Update,
  })
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBy') updateBy: UpdateDictionaryBy,
  ) {
    return this.dictionaryService.update(id, updateBy);
  }

  @Mutation(() => Boolean, { description: '删除字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}

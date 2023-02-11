// nest
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
// project
import { DictionaryService } from './dictionary.service';
import { Dictionary } from './entities/dictionary.entity';
import { Pagination, Permission } from 'assets/decorators';
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { PaginatedDictionaries } from './dto/paginated-dictionaries';
import { PaginationInput } from 'assets/dto';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Create,
  })
  createDictionary(
    @Args('createDictionaryInput') dictionary: CreateDictionaryInput,
  ) {
    return this.dictionaryService.create(dictionary);
  }

  @Query(() => PaginatedDictionaries, {
    name: 'dictionaries',
    description: '分页查询字典',
  })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaries(@Pagination() pagination: PaginationInput) {
    return this.dictionaryService.getDictionaries({
      pagination,
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
    @Args('updateDictionaryInput') updateDictionaryInput: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, updateDictionaryInput);
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

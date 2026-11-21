import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DictionaryService } from './dictionary.service.js';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';
import { PaginatedDictionaries } from './dto/paginated-dictionaries.object.js';
import { Pagination } from 'assets/dto/pagination.input';
import { CreateDictionaryInput } from './dto/create-dictionary.input.js';
import { UpdateDictionaryInput } from './dto/update-dictionary.input.js';
import { Authorization } from 'utils/decorators/authorization.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import {
  AUTHORIZATION_ACTION_CODE,
  AUTHORIZATION_RESOURCE_CODE,
} from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY,
    action: AUTHORIZATION_ACTION_CODE.CREATE,
  })
  createDictionary(@Args('input') input: CreateDictionaryInput) {
    return this.dictionaryService.create(input);
  }

  @Query(() => PaginatedDictionaries, {
    name: 'dictionaries',
    description: '分页查询字典',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY,
    action: AUTHORIZATION_ACTION_CODE.READ,
  })
  dictionaries(@PaginationArgs() pagination: Pagination) {
    return this.dictionaryService.getDictionaries({
      pagination,
    });
  }

  @Query(() => Dictionary, { name: 'dictionary', description: '查询单个字典' })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY,
    action: AUTHORIZATION_ACTION_CODE.READ,
  })
  dictionay(@Args('code', { type: () => String }) code: string) {
    return this.dictionaryService.dictionay(code);
  }

  @Mutation(() => Boolean, { description: '更新字典' })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY,
    action: AUTHORIZATION_ACTION_CODE.UPDATE,
  })
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, input);
  }

  @Mutation(() => Boolean, { description: '删除字典' })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY,
    action: AUTHORIZATION_ACTION_CODE.DELETE,
  })
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}

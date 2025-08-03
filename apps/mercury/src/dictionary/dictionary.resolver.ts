import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';
import { PaginatedDictionaries } from './dto/paginated-dictionaries.object';
import { Pagination } from 'assets/dto/pagination.input';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  @Permission({
    resource: Dictionary.name,
    action: AuthorizationActionCode.Create,
  })
  createDictionary(@Args('input') input: CreateDictionaryInput) {
    return this.dictionaryService.create(input);
  }

  @Query(() => PaginatedDictionaries, {
    name: 'dictionaries',
    description: '分页查询字典',
  })
  @Permission({
    resource: Dictionary.name,
    action: AuthorizationActionCode.Read,
  })
  dictionaries(@PaginationArgs() pagination: Pagination) {
    return this.dictionaryService.getDictionaries({
      pagination,
    });
  }

  @Query(() => Dictionary, { name: 'dictionary', description: '查询单个字典' })
  @Permission({
    resource: Dictionary.name,
    action: AuthorizationActionCode.Read,
  })
  dictionay(@Args('code', { type: () => String }) code: string) {
    return this.dictionaryService.dictionay(code);
  }

  @Mutation(() => Boolean, { description: '更新字典' })
  @Permission({
    resource: Dictionary.name,
    action: AuthorizationActionCode.Update,
  })
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, input);
  }

  @Mutation(() => Boolean, { description: '删除字典' })
  @Permission({
    resource: Dictionary.name,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}

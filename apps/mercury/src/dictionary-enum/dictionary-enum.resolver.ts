import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';
import { PaginatedDictionaryEnum } from './dto/paginated-dictionary-enums.object';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';
import { Pagination } from 'assets/dto/pagination.input';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';
import { Authorization } from 'utils/decorators/authorization.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import {
  AUTHORIZATION_ACTION_CODE,
  AUTHORIZATION_RESOURCE_CODE,
} from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum, {
    description: '创建字典枚举',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY_ENUM,
    action: AUTHORIZATION_ACTION_CODE.CREATE,
  })
  createDictionaryEnum(
    @Args('input')
    input: CreateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.create(input);
  }

  @Query(() => PaginatedDictionaryEnum, {
    description: '分页查询字典枚举',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY_ENUM,
    action: AUTHORIZATION_ACTION_CODE.READ,
  })
  dictionaryEnums(@PaginationArgs() pagination: Pagination) {
    return this.dictionaryEnumService.dictionaryEnums({
      pagination,
    });
  }

  @Query(() => DictionaryEnum, {
    description: '查询单个字典枚举',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY_ENUM,
    action: AUTHORIZATION_ACTION_CODE.READ,
  })
  dictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.dictionaryEnum(id);
  }

  @Mutation(() => Boolean, {
    description: '更新字典枚举',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY_ENUM,
    action: AUTHORIZATION_ACTION_CODE.UPDATE,
  })
  updateDictionaryEnum(
    @Args('id', { type: () => Int }) id: number,
    @Args('input')
    input: UpdateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.update(id, input);
  }

  @Mutation(() => Boolean, {
    description: '删除字典枚举',
  })
  @Authorization({
    resource: AUTHORIZATION_RESOURCE_CODE.DICTIONARY_ENUM,
    action: AUTHORIZATION_ACTION_CODE.DELETE,
  })
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}

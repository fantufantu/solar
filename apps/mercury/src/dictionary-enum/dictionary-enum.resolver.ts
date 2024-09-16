import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination, Permission } from 'assets/decorators';
import { AuthorizationActionCode } from '@/lib/database/entities/mercury/authorization-action.entity';
import { AuthorizationResourceCode } from '@/lib/database/entities/mercury/authorization-resource.entity';
import { DictionaryEnumService } from './dictionary-enum.service';
import { PaginatedDictionaryEnum } from './dto/paginated-dictionary-enums';
import { DictionaryEnum } from '../../../../libs/database/src/entities/mercury/dictionary-enum.entity';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { CreateDictionaryEnumBy } from './dto/create-dictionary-enum-by.input';
import { UpdateDictionaryEnumBy } from './dto/update-dictionary-enum-by.input';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum, {
    description: '创建字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Create,
  })
  createDictionaryEnum(
    @Args('createBy')
    createBy: CreateDictionaryEnumBy,
  ) {
    return this.dictionaryEnumService.create(createBy);
  }

  @Query(() => PaginatedDictionaryEnum, {
    name: 'dictionaryEnums',
    description: '分页查询字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaryEnums(@Pagination() paginateBy: PaginateBy) {
    return this.dictionaryEnumService.getDictionaryEnums({
      paginateBy,
    });
  }

  @Query(() => DictionaryEnum, {
    name: 'dictionaryEnum',
    description: '查询单个字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.getDictionaryEnum(id);
  }

  @Mutation(() => Boolean, {
    description: '更新字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Update,
  })
  updateDictionaryEnum(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBy')
    updateBy: UpdateDictionaryEnumBy,
  ) {
    return this.dictionaryEnumService.update(id, updateBy);
  }

  @Mutation(() => Boolean, {
    description: '删除字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}

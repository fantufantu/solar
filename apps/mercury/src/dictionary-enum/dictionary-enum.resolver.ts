import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';
import { PaginatedDictionaryEnum } from './dto/paginated-dictionary-enums.object';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { CreateDictionaryEnumBy } from './dto/create-dictionary-enum-by.input';
import { UpdateDictionaryEnumBy } from './dto/update-dictionary-enum-by.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { Pagination } from 'utils/decorators/filter.decorator';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum, {
    description: '创建字典枚举',
  })
  @Permission({
    resource: DictionaryEnum.name,
    action: AuthorizationActionCode.Create,
  })
  createDictionaryEnum(
    @Args('createBy')
    createBy: CreateDictionaryEnumBy,
  ) {
    return this.dictionaryEnumService.create(createBy);
  }

  @Query(() => PaginatedDictionaryEnum, {
    description: '分页查询字典枚举',
  })
  @Permission({
    resource: DictionaryEnum.name,
    action: AuthorizationActionCode.Read,
  })
  dictionaryEnums(@Pagination() paginateBy: PaginateBy) {
    return this.dictionaryEnumService.dictionaryEnums({
      paginateBy,
    });
  }

  @Query(() => DictionaryEnum, {
    description: '查询单个字典枚举',
  })
  @Permission({
    resource: DictionaryEnum.name,
    action: AuthorizationActionCode.Read,
  })
  dictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.dictionaryEnum(id);
  }

  @Mutation(() => Boolean, {
    description: '更新字典枚举',
  })
  @Permission({
    resource: DictionaryEnum.name,
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
    resource: DictionaryEnum.name,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}

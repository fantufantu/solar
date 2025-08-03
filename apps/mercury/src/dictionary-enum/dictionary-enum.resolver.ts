import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';
import { PaginatedDictionaryEnum } from './dto/paginated-dictionary-enums.object';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';
import { Pagination } from 'assets/dto/pagination.input';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
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
    @Args('input')
    input: CreateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.create(input);
  }

  @Query(() => PaginatedDictionaryEnum, {
    description: '分页查询字典枚举',
  })
  @Permission({
    resource: DictionaryEnum.name,
    action: AuthorizationActionCode.Read,
  })
  dictionaryEnums(@PaginationArgs() pagination: Pagination) {
    return this.dictionaryEnumService.dictionaryEnums({
      pagination,
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
    @Args('input')
    input: UpdateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.update(id, input);
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

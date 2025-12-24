import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CacheToken } from 'assets/tokens';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { Pagination } from 'assets/dto/pagination.input';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { FilterUserInput } from './dto/filter-user.input';
import { PaginatedUsers } from './dto/paginated-users.object';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: '我是谁',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  whoAmI(@WhoAmI() who: User | null) {
    return who;
  }

  @Query(() => PaginatedUsers, {
    description: '分页查询用户列表（接口严格鉴权）',
  })
  @UseInterceptors(PaginatedInterceptor)
  @UseGuards(JwtAuthGuard)
  async paginateUsers(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs() filter: FilterUserInput,
  ) {
    return await this.userService.paginateUsers({
      filter,
      pagination,
    });
  }

  @Mutation(() => Boolean, {
    description: '更新用户信息',
  })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @WhoAmI() whoAmI: User,
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.userService.updateUser(whoAmI.id, input);
  }

  @Mutation(() => Date, {
    description: '发送注册验证码',
  })
  sendRegisterCaptcha(@Args({ name: 'to', type: () => String }) to: string) {
    return this.userService.sendCaptcha(to, CacheToken.RegisterCaptcha);
  }

  @Mutation(() => Date, {
    description: '发送修改密码验证码',
    nullable: true,
  })
  sendChangePasswordCaptcha(
    @Args({ name: 'to', type: () => String }) to: string,
  ) {
    return this.userService.sendCaptcha(to, CacheToken.ChangePasswordCaptcha);
  }

  @ResolveReference()
  async user(reference: { __typename: string; id: number }) {
    return await this.userService.user(reference.id);
  }
}

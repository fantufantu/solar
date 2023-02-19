// nest
import { JwtAuthGuard } from '@app/passport/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, ResolveReference } from '@nestjs/graphql';
import { WhoAmI } from 'assets/decorators';
import { SetDefaultArgs } from './dto/set-default.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean, {
    description: '设置默认账本',
  })
  @UseGuards(JwtAuthGuard)
  setDefault(@Args() setDefaultArgs: SetDefaultArgs, @WhoAmI() user: User) {
    return this.userService.setDefault(setDefaultArgs, user.id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return {
      id: reference.id,
      defaultBilling: null,
    };
  }
}

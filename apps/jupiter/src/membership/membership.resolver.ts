import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import { Membership } from '@/libs/database/entities/jupiter/membership.entity';

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(private readonly membershipService: MembershipService) {}

  @Query(() => [Membership], { description: '获取所有会员等级' })
  memberships() {
    return this.membershipService.findAll();
  }

  @Query(() => Membership, { nullable: true, description: '根据ID获取会员等级' })
  membership(@Args('id', { type: () => Int }) id: number) {
    return this.membershipService.findOne(id);
  }

  @Mutation(() => Membership, { description: '创建会员等级' })
  createMembership(
    @Args('name') name: string,
    @Args('quota', { type: () => Int }) quota: number,
    @Args('price', { type: () => Int }) price: number,
  ) {
    return this.membershipService.create(name, quota, price);
  }

  @Mutation(() => Membership, { description: '更新会员等级' })
  updateMembership(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('quota', { type: () => Int, nullable: true }) quota?: number,
    @Args('price', { type: () => Int, nullable: true }) price?: number,
  ) {
    return this.membershipService.update(id, { name, quota, price });
  }

  @Mutation(() => Boolean, { description: '删除会员等级' })
  removeMembership(@Args('id', { type: () => Int }) id: number) {
    return this.membershipService.remove(id);
  }
}

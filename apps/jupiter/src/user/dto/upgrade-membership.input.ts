import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpgradeMembershipInput {
  @Field(() => Int, { description: '用户`id`' })
  userId!: number;

  @Field(() => Int, { description: '会员等级`id`' })
  membershipId!: number;
}

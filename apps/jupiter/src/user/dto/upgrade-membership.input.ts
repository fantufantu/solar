import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpgradeMembershipInput {
  @Field(() => String, { description: '用户`id`' })
  userId!: string;

  @Field(() => Int, { description: '会员等级`id`' })
  membershipId!: number;
}

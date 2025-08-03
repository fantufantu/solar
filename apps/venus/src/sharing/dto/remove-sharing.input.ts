import { Field, InputType, Int } from '@nestjs/graphql';
import { TargetType } from '@/libs/database/entities/venus/sharing.entity';

@InputType()
export class RemoveSharingInput {
  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;

  @Field(() => Int, {
    description: '分享id',
  })
  sharedById?: number;
}

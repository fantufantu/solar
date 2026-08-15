import { Field, InputType, Int } from '@nestjs/graphql';
import {
  TARGET_TYPE,
  TargetType,
} from '@/libs/database/entities/venus/sharing.entity';

@InputType()
export class RemoveSharingInput {
  @Field(() => TARGET_TYPE, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;

  @Field(() => String, {
    description: '分享id',
  })
  sharedById?: string;
}

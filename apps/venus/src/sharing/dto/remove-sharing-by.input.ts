// nest
import { Field, InputType, Int } from '@nestjs/graphql';
// project
import { TargetType } from '../entities/sharing.entity';

@InputType()
export class RemoveSharingBy {
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

import { Field, InputType, Int } from '@nestjs/graphql';
import { TargetType } from '@/libs/database/entities/venus/sharing.entity';

@InputType()
export class CreateSharingBy {
  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;

  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '共享给指定用户',
  })
  sharedById: number;
}

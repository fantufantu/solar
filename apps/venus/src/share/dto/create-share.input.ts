// nest
import { Field, InputType, Int } from '@nestjs/graphql';
// project
import { TargetType } from '../entities/share.entity';

@InputType()
export class CreateShareInput {
  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;

  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => [Int], {
    description: '共享人Ids',
  })
  sharedByIds: number[];
}

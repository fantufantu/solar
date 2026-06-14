import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTouristPlanInput extends PickType(
  TouristPlan,
  ['depatureAt', 'duration', 'cityCodes', 'attractionCodes'],
  InputType,
) {
  @Field(() => String, {
    description: '出行方案归属方',
  })
  belongToId!: string;
}

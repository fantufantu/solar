import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
class AttractionInput extends PickType(
  Attraction,
  ['code', 'name', 'cityCode'],
  InputType,
) {}

@InputType()
export class CreateTouristPlanInput extends PickType(
  TouristPlan,
  ['depatureAt', 'duration'],
  InputType,
) {
  @Field(() => [String], {
    description: '出行目的地城市code列表',
  })
  cities!: string[];

  @Field(() => [AttractionInput], {
    description: '出行景区列表',
  })
  attractions!: AttractionInput[];

  @Field(() => String, {
    description: '出行方案归属方',
  })
  belongToId!: string;
}

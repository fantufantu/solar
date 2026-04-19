import {
  Attraction,
  City,
  TouristPlan,
} from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { Field, InputType, OmitType, PickType } from '@nestjs/graphql';

@InputType()
class CityInput extends OmitType(City, [], InputType) {}

@InputType()
class AttractionInput extends OmitType(Attraction, [], InputType) {}

@InputType()
export class CreateTouristPlanInput extends PickType(
  TouristPlan,
  ['depatureAt', 'duration'],
  InputType,
) {
  @Field(() => [CityInput], {
    description: '出行目的地列表',
  })
  cities!: CityInput[];

  @Field(() => [AttractionInput], {
    description: '出行景区列表',
  })
  attractions!: AttractionInput[];
}

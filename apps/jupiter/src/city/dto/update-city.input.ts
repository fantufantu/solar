import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { City } from '@/libs/database/entities/jupiter/city.entity';

@InputType()
export class UpdateCityInput extends PartialType(
  PickType(City, ['name', 'image'], InputType),
) {}

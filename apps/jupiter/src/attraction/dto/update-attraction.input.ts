import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';

@InputType()
export class UpdateAttractionInput extends PartialType(
  PickType(Attraction, ['name', 'cityCode', 'image'], InputType),
) {}

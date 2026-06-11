import { InputType, PickType } from '@nestjs/graphql';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';

@InputType()
export class CreateAttractionInput extends PickType(
  Attraction,
  ['code', 'name', 'cityCode', 'image'],
  InputType,
) {}

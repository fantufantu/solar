import { InputType, PickType } from '@nestjs/graphql';
import { District } from '@/libs/database/entities/jupiter/district.entity';

@InputType()
export class CreateDistrictInput extends PickType(
  District,
  ['code', 'name', 'level', 'image'],
  InputType,
) {}

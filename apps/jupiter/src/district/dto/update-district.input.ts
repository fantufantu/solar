import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { District } from '@/libs/database/entities/jupiter/district.entity';

@InputType()
export class UpdateDistrictInput extends PartialType(
  PickType(District, ['name', 'level', 'image', 'parentCode'], InputType),
) {}

import { InputType, PickType } from '@nestjs/graphql';
import { City } from '@/libs/database/entities/jupiter/city.entity';

@InputType()
export class CreateCityInput extends PickType(City, ['code', 'name', 'image'], InputType) {}

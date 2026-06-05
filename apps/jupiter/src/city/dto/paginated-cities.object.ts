import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { City } from '@/libs/database/entities/jupiter/city.entity';

@ObjectType()
export class PaginatedCities extends Paginated(City) {}

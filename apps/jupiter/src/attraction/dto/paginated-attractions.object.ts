import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';

@ObjectType()
export class PaginatedAttractions extends Paginated(Attraction) {}

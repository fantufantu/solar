import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { District } from '@/libs/database/entities/jupiter/district.entity';

@ObjectType()
export class PaginatedDistricts extends Paginated(District) {}

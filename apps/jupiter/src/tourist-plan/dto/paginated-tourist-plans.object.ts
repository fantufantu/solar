import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';

@ObjectType()
export class PaginatedTouristPlans extends Paginated(TouristPlan) {}

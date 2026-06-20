import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';

@InputType()
export class UpdateTouristPlanItineraryInput extends PartialType(
  PickType(TouristPlanItinerary, ['dayFrom', 'sortOrder', 'name', 'description', 'tip', 'duration'], InputType),
) {}

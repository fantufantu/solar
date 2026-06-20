import { InputType, PickType } from '@nestjs/graphql';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';

@InputType()
export class CreateTouristPlanItineraryInput extends PickType(
  TouristPlanItinerary,
  ['touristPlanId', 'dayFrom', 'sortOrder', 'name', 'description', 'tip', 'duration'],
  InputType,
) {}

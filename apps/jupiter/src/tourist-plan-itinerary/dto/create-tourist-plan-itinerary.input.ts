import { InputType, PickType } from '@nestjs/graphql';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';

@InputType()
export class CreateTouristPlanItineraryInput extends PickType(
  TouristPlanItinerary,
  ['touristPlanId', 'dayNumber', 'sortOrder', 'name', 'description', 'tip', 'startAt', 'duration'],
  InputType,
) {}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';
import { TouristPlanItineraryService } from './tourist-plan-itinerary.service';
import { CreateTouristPlanItineraryInput } from './dto/create-tourist-plan-itinerary.input';
import { UpdateTouristPlanItineraryInput } from './dto/update-tourist-plan-itinerary.input';
import { ReorderTouristPlanItineraryInput } from './dto/reorder-tourist-plan-itinerary.input';

@Resolver(() => TouristPlanItinerary)
export class TouristPlanItineraryResolver {
  constructor(
    private readonly itineraryService: TouristPlanItineraryService,
  ) {}

  @Mutation(() => TouristPlanItinerary, { description: '创建行程明细项' })
  createTouristPlanItinerary(
    @Args('input') input: CreateTouristPlanItineraryInput,
  ): Promise<TouristPlanItinerary> {
    return this.itineraryService.create(input);
  }

  @Mutation(() => TouristPlanItinerary, { description: '更新行程明细项' })
  updateTouristPlanItinerary(
    @Args('id') id: string,
    @Args('input') input: UpdateTouristPlanItineraryInput,
  ): Promise<TouristPlanItinerary> {
    return this.itineraryService.update(id, input);
  }

  @Mutation(() => Boolean, { description: '删除行程明细项' })
  deleteTouristPlanItinerary(@Args('id') id: string): Promise<boolean> {
    return this.itineraryService.delete(id);
  }

  @Mutation(() => [TouristPlanItinerary], { description: '重新排序行程明细项' })
  reorderTouristPlanItineraries(
    @Args('touristPlanId') touristPlanId: string,
    @Args('input') input: ReorderTouristPlanItineraryInput,
  ): Promise<TouristPlanItinerary[]> {
    return this.itineraryService.reorder(touristPlanId, input.itemIds);
  }

  @Query(() => [TouristPlanItinerary], {
    description: '根据出行方案`id`查询行程明细列表',
  })
  touristPlanItineraries(
    @Args('touristPlanId') touristPlanId: string,
  ): Promise<TouristPlanItinerary[]> {
    return this.itineraryService.findByTouristPlanId(touristPlanId);
  }
}

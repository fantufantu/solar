import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReorderTouristPlanItineraryInput {
  @Field(() => [String], { description: '按新顺序排列的行程明细`id`列表' })
  itemIds!: string[];
}

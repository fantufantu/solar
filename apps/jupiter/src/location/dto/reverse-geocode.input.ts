import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class ReverseGeocodeInput {
  @Field(() => Float, { description: '纬度' })
  latitude!: number;

  @Field(() => Float, { description: '经度' })
  longitude!: number;
}

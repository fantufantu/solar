import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReverseGeocodeResult {
  @Field(() => String, { description: '当前城市区划代码' })
  districtCode!: string;

  @Field(() => String, { description: '当前城市名称' })
  districtName!: string;
}

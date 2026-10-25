import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AmapCredential {
  @Field(() => String, { description: '高德地图`API`密钥' })
  apiKey!: string;

  @Field(() => String, { description: '高德地图`API`安全密钥' })
  apiSecret!: string;
}

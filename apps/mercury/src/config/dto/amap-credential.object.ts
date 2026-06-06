import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AmapCredential {
  @Field(() => String, { description: '高德地图 API 密钥' })
  apiKey!: string;
}

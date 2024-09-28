import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Credential {
  @Field(() => String, { description: '临时秘钥id' })
  secretId: string;

  @Field(() => String, { description: '临时秘钥key' })
  secretKey: string;
}

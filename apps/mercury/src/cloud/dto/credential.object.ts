import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Credential {
  @Field(() => String, { description: '临时密钥id' })
  secretId: string;

  @Field(() => String, { description: '临时密钥key' })
  secretKey: string;

  @Field(() => String, { description: '临时密钥token' })
  securityToken: string;

  @Field(() => String, { description: 'bucket' })
  bucket: string;

  @Field(() => String, { description: 'region' })
  region: string;
}

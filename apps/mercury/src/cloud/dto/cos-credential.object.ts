import { ValueOf } from '@aiszlab/relax/types';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';

export const BUCKET_NAME = {
  fantu: 'fantu',
  knowthy: 'knowthy',
} as const;

export type BucketName = ValueOf<typeof BUCKET_NAME>;

registerEnumType(BUCKET_NAME, {
  name: GraphQLEnumToken.BucketName,
  description: '腾讯云`COS`存储桶名称',
});

@ObjectType()
export class CosCredential {
  @Field(() => String, { description: '腾讯云`COS`临时密钥`id`' })
  secretId: string;

  @Field(() => String, { description: '腾讯云`COS`临时密钥`key`' })
  secretKey: string;

  @Field(() => String, { description: '腾讯云`COS`临时密钥`token`' })
  securityToken: string;

  @Field(() => String, { description: '腾讯云`COS`存储桶标识' })
  bucket: string;

  @Field(() => String, { description: '腾讯云`COS`存储桶区域' })
  region: string;
}

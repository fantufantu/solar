import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  BUCKET_NAME,
  BucketName,
  CosCredential,
} from './dto/cos-credential.object';
import { CloudService } from './cloud.service';

@Resolver()
export class CloudResolver {
  constructor(private readonly cloudService: CloudService) {}

  @Query(() => CosCredential, {
    description: '获取腾讯云`COS`临时秘钥',
  })
  async cosCredential(
    @Args('bucketName', { type: () => BUCKET_NAME }) bucketName: BucketName,
  ) {
    return await this.cloudService.cosCredential(bucketName);
  }
}

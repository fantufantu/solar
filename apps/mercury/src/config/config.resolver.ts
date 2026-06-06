import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  BUCKET_NAME,
  BucketName,
  CosCredential,
} from './dto/cos-credential.object';
import { AmapCredential } from './dto/amap-credential.object';
import { ConfigService } from './config.service';

@Resolver()
export class ConfigResolver {
  constructor(private readonly configService: ConfigService) {}

  @Query(() => CosCredential, {
    description: '获取腾讯云`COS`临时秘钥',
  })
  async cosCredential(
    @Args('bucketName', { type: () => BUCKET_NAME }) bucketName: BucketName,
  ) {
    return await this.configService.cosCredential(bucketName);
  }

  @Query(() => AmapCredential, {
    description: '获取高德地图 API 密钥',
  })
  async amapCredential() {
    return await this.configService.amapCredential();
  }
}

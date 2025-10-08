import { Args, Query, Resolver } from '@nestjs/graphql';
import { Credential } from './dto/credential.object';
import { CloudService } from './cloud.service';

@Resolver()
export class CloudResolver {
  constructor(private readonly cloudService: CloudService) {}

  @Query(() => Credential, {
    description: '获取腾讯云COS临时秘钥',
  })
  async credential(@Args('bucketName') bucketName: string) {
    return await this.cloudService.credential(bucketName);
  }
}

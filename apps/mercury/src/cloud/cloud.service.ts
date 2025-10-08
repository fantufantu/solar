import { PlutoClientService } from '@/libs/pluto-client';
import { Injectable } from '@nestjs/common';
import {
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { getCredential, getPolicy } from 'qcloud-cos-sts';
import { Credential } from './dto/credential.object';

@Injectable()
export class CloudService {
  /**
   * 腾讯云`COS`配置项
   */
  buckets = new Map([
    [
      'fantu',
      {
        bucket: TencentCloudPropertyToken.FantuBucket,
        region: TencentCloudPropertyToken.FantuBucketRegion,
      },
    ],
    [
      'knowthy',
      {
        bucket: TencentCloudPropertyToken.KnowthyBucket,
        region: TencentCloudPropertyToken.KnowthyBucketRegion,
      },
    ],
  ]);

  constructor(private readonly plutoClient: PlutoClientService) {}

  /**
   * 获取腾讯云`COS`临时秘钥
   */
  async credential(bucketName: string): Promise<Credential> {
    const _bucket = this.buckets.get(bucketName);
    if (!_bucket) {
      throw new Error('未配置当前存储桶对应的配置内容');
    }

    const [secretId, secretKey, bucket, region] =
      await this.plutoClient.getConfigurations<
        [string, string, string, string]
      >([
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: TencentCloudPropertyToken.SecretId,
        },
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: TencentCloudPropertyToken.SecretKey,
        },
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: _bucket.bucket,
        },
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: _bucket.region,
        },
      ]);

    if (!secretId || !secretKey || !bucket || !region) {
      throw new Error('腾讯云`COS`配置项缺失！');
    }

    const _cretenial = (
      await getCredential({
        secretId,
        secretKey,
        policy: getPolicy([
          {
            action: [
              'name/cos:PutObject',
              'name/cos:PostObject',
              'name/cos:GetBucket',
              'name/cos:GetObject',
            ],
            bucket,
            region,
            prefix: '*',
          },
        ]),
      })
    ).credentials;

    return {
      secretId: _cretenial.tmpSecretId,
      secretKey: _cretenial.tmpSecretKey,
      securityToken: _cretenial.sessionToken,
      bucket,
      region,
    };
  }
}

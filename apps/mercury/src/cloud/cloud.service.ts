import { PlutoClientService } from '@/libs/pluto-client';
import { Injectable } from '@nestjs/common';
import { ConfigurationRegisterToken } from 'assets/tokens';
import { getCredential, getPolicy } from 'qcloud-cos-sts';
import {
  BUCKET_NAME,
  BucketName,
  CosCredential,
} from './dto/cos-credential.object';
import { TENCENT_CLOUD_CONFIGURATION } from 'constants/cloud';

@Injectable()
export class CloudService {
  /**
   * 腾讯云`COS`配置项
   */
  buckets = new Map([
    [
      BUCKET_NAME.fantu,
      {
        bucket: TENCENT_CLOUD_CONFIGURATION.fantu_bucket,
        region: TENCENT_CLOUD_CONFIGURATION.fantu_bucket_region,
      },
    ],
    [
      BUCKET_NAME.knowthy,
      {
        bucket: TENCENT_CLOUD_CONFIGURATION.knowthy_bucket,
        region: TENCENT_CLOUD_CONFIGURATION.knowthy_bucket_region,
      },
    ],
  ]);

  constructor(private readonly plutoClient: PlutoClientService) {}

  /**
   * 获取腾讯云`COS`临时秘钥
   */
  async cosCredential(bucketName: BucketName): Promise<CosCredential> {
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
          property: TENCENT_CLOUD_CONFIGURATION.secret_id,
        },
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: TENCENT_CLOUD_CONFIGURATION.secret_key,
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

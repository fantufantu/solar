import { PlutoClientService } from '@/libs/pluto-client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getCredential, getPolicy } from 'qcloud-cos-sts';
import {
  BUCKET_NAME,
  BucketName,
  CosCredential,
} from './dto/cos-credential.object';
import { AmapCredential } from './dto/amap-credential.object';
import { TENCENT_CLOUD_CONFIGURATION } from 'constants/cloud';
import {
  AMAP_PROPERTY_TOKEN,
  REGISTERED_CONFIGURATION_TOKENS,
} from 'constants/configuration';

@Injectable()
export class ConfigService {
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
      throw new BadRequestException('未配置当前存储桶对应的配置内容');
    }

    const [secretId, secretKey, bucket, region] =
      await this.plutoClient.getConfigurations<
        [string, string, string, string]
      >([
        {
          token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
          property: TENCENT_CLOUD_CONFIGURATION.secret_id,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
          property: TENCENT_CLOUD_CONFIGURATION.secret_key,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
          property: _bucket.bucket,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
          property: _bucket.region,
        },
      ]);

    if (!secretId || !secretKey || !bucket || !region) {
      throw new BadRequestException('腾讯云`COS`配置项缺失！');
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

  /**
   * 获取高德地图 API 密钥
   */
  async amapCredential(): Promise<AmapCredential> {
    const apiKey = await this.plutoClient.getConfiguration<string>({
      token: REGISTERED_CONFIGURATION_TOKENS.AMAP,
      property: AMAP_PROPERTY_TOKEN.API_KEY,
    });

    if (!apiKey) {
      throw new BadRequestException('高德地图 API 密钥未配置');
    }

    return { apiKey };
  }
}

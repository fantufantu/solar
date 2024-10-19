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
  constructor(private readonly plutoClient: PlutoClientService) {}

  /**
   * @description
   * 获取腾讯云COS临时秘钥
   */
  async getCredential(): Promise<Credential> {
    const [secretId, secretKey, bucket, region] = await Promise.all([
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretId,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretKey,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.Bucket,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.BucketRegion,
      }),
    ]);

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

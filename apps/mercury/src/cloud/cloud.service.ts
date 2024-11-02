import { PlutoClientService } from '@/libs/pluto-client';
import { Injectable } from '@nestjs/common';
import {
  ConfigurationRegisterToken,
  OpenaiPropertyToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { getCredential, getPolicy } from 'qcloud-cos-sts';
import { Credential } from './dto/credential.object';
import { ChatOpenAI, ClientOptions } from '@langchain/openai';

@Injectable()
export class CloudService {
  robot: ChatOpenAI | null;

  constructor(private readonly plutoClient: PlutoClientService) {
    this.initializeRobot();
  }

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

  /**
   * @description 初始化 openai 机器人
   */
  async initializeRobot() {
    const [apiKey, baseURL] = await Promise.all([
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.Openai,
        property: OpenaiPropertyToken.ApiKey,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.Openai,
        property: OpenaiPropertyToken.BaseUrl,
      }),
    ]);

    this.robot = new ChatOpenAI({
      apiKey,
      configuration: { baseURL },
    });
  }

  /**
   * @description
   * open ai 对话
   */
  chat(message: string) {}
}

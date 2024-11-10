import { PlutoClientService } from '@/libs/pluto-client';
import { Injectable, MessageEvent } from '@nestjs/common';
import {
  ConfigurationRegisterToken,
  OpenaiPropertyToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { getCredential, getPolicy } from 'qcloud-cos-sts';
import { Credential } from './dto/credential.object';
import { ChatOpenAI } from '@langchain/openai';
import { Observable } from 'rxjs';

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
          property: TencentCloudPropertyToken.Bucket,
        },
        {
          token: ConfigurationRegisterToken.TencentCloud,
          property: TencentCloudPropertyToken.BucketRegion,
        },
      ]);

    if (!secretId || !secretKey || !bucket || !region) {
      throw new Error('腾讯云COS配置项缺失！');
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
   * @description
   * 初始化 openai 机器人
   */
  async initializeRobot() {
    const [apiKey, baseURL, model] = await this.plutoClient.getConfigurations<
      [string, string, string]
    >([
      {
        token: ConfigurationRegisterToken.Openai,
        property: OpenaiPropertyToken.ApiKey,
      },
      {
        token: ConfigurationRegisterToken.Openai,
        property: OpenaiPropertyToken.BaseUrl,
      },
      {
        token: ConfigurationRegisterToken.Openai,
        property: OpenaiPropertyToken.Model,
      },
    ]);

    // 配置缺失时，对话机器人不进行初始化
    if (!apiKey || !baseURL || !model) {
      return;
    }

    this.robot = new ChatOpenAI({
      apiKey,
      configuration: { baseURL },
      model,
    });
  }

  /**
   * @description
   * open ai 对话
   */
  chat(message: string) {
    return new Observable<MessageEvent>((subscriber) => {
      if (!this.robot) {
        subscriber.error(new Error('对话机器人初始化失败！请检查配置项！'));
        return;
      }

      this.robot
        .stream(message)
        .then(async (_) => {
          for await (const chunk of _) {
            subscriber.next({
              data: chunk.content,
              id: chunk.id,
            });
          }
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        })
        .finally(() => {
          subscriber.unsubscribe();
        });
    });
  }
}

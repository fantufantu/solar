import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { PlutoClientService } from '@/libs/pluto-client';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';
import { VOLC_ARK_PROPERTY_TOKENS } from 'constants/volc-ark';
import { usePlanPrompt } from './prompts/plan.prompt';
import { PlanInput } from './dto/plan.input';

@Injectable()
export class TouristGuideService {
  constructor(private readonly plutoClient: PlutoClientService) {}

  /**
   * 开始计划出行方案
   */
  async plan(input: PlanInput) {
    const plan$ = new Observable((subscriber) => {
      this.generatePlan(input)
        .then(async (chunks) => {
          for await (const chunk of chunks) {
            subscriber.next(chunk);
          }
        })
        .catch((err) => {
          subscriber.error(err);
        })
        .finally(() => {
          subscriber.complete();
        });
    });

    return plan$;
  }

  /**
   * 生成出行方案
   */
  async generatePlan(input: PlanInput) {
    const {
      '0': [model, apiKey, baseURL],
      '1': prompt,
    } = await Promise.all([
      this.plutoClient.getConfigurations<[string, string, string]>([
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_MODEL,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_API_KEY,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_BASE_URL,
        },
      ]),
      usePlanPrompt(input),
    ]);

    const chat = new ChatOpenAI({
      model,
      configuration: {
        baseURL,
        apiKey,
      },
    });

    return chat.stream(prompt);
  }
}

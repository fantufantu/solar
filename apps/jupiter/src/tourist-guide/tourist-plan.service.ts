import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { PlutoClientService } from '@/libs/pluto-client';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';
import { VOLC_ARK_PROPERTY_TOKENS } from 'constants/volc-ark';
import { useProposalPrompt } from './prompts/proposal.prompt';
import { CreateTouristPlanInput } from './dto/create-tourist-plan.input';
import { InjectRepository } from '@nestjs/typeorm';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { isString } from '@aiszlab/relax';

@Injectable()
export class TouristPlanService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    @InjectRepository(TouristPlan)
    private readonly touristPlanRepository: Repository<TouristPlan>,
  ) {}

  /**
   * 读取出行方案
   */
  async proposal(id: string) {
    const proposal$ = new Observable<string>((subscriber) => {
      this.generateTouristPlan(id)
        .then(async (chunks) => {
          if (isString(chunks)) {
            subscriber.next(chunks);
            return;
          }

          for await (const chunk of chunks) {
            subscriber.next(chunk.content.toString());
          }
        })
        .catch((err) => {
          subscriber.error(err);
        })
        .finally(() => {
          subscriber.complete();
        });
    });

    return proposal$.pipe((source) => {
      return new Observable<string>((subscriber) => {
        let proposal: string | null = null;

        source.subscribe({
          next: (value) => {
            proposal = (proposal ?? '') + value;
            subscriber.next(value);
          },
          complete: () => {
            // 记录`Agent`生成的出行方案
            Promise.all([
              this.touristPlanRepository.update(id, {
                proposal: proposal ?? '',
              }),
              subscriber.complete(),
            ]);

            return () => {
              proposal = null;
            };
          },
        });
      });
    });
  }

  /**
   * 生成出行方案
   */
  async generateTouristPlan(id: string) {
    const _touristPlan = await this.touristPlanRepository.findOneBy({
      id,
    });

    if (!_touristPlan) {
      throw new Error('Tourist plan not found');
    }

    if (_touristPlan.proposal) {
      return _touristPlan.proposal;
    }

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
      useProposalPrompt({
        cities: _touristPlan.cities.map((item) => item.name).join(','),
        depatureAt: dayjs(_touristPlan.depatureAt).format('YYYY-MM-DD'),
        duration: _touristPlan.duration,
        attractions: _touristPlan.attractions
          .map((item) => item.name)
          .join(','),
      }),
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

  /**
   * 创建出行方案
   */
  async create(input: CreateTouristPlanInput) {
    return await this.touristPlanRepository.save(
      this.touristPlanRepository.create(input),
    );
  }

  /**
   * 查询出行计划
   */
  async touristPlan(id: string) {
    return await this.touristPlanRepository
      .findOneBy({
        id,
      })
      .then((_touristPlan) => {
        if (!_touristPlan) {
          throw new Error('Tourist plan not found');
        }

        return _touristPlan;
      });
  }
}

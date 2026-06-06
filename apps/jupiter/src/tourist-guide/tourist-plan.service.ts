import { BadRequestException, Injectable, MessageEvent } from '@nestjs/common';
import { endWith, map, Observable, shareReplay } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { PlutoClientService } from '@/libs/pluto-client';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';
import { VOLC_ARK_PROPERTY_TOKENS } from 'constants/volc-ark';
import { useProposalPrompt } from './prompts/proposal.prompt';
import { useParseTextPrompt } from './prompts/parse-text.prompt';
import { CreateTouristPlanInput } from './dto/create-tourist-plan.input';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';
import { AttractionService } from '../attraction/attraction.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TouristPlan,
  ITINERARY_SCHEMA,
} from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { Repository } from 'typeorm';
import { Query } from 'typings/controller';
import { FilterTouristPlansInput } from './dto/filter-tourist-plans.input';
import dayjs from 'dayjs';
import { isString } from '@aiszlab/relax';
import { COMPLETED_MESSAGE_EVENT } from 'utils/sse.util';
import { STATUS_CODE } from 'constants/sse.constant';
import { OPENAI_PROPERTY_TOKEN } from 'constants/configuration';

@Injectable()
export class TouristPlanService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    @InjectRepository(TouristPlan)
    private readonly touristPlanRepository: Repository<TouristPlan>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
    private readonly attractionService: AttractionService,
  ) {}

  /**
   * 读取出行方案
   */
  proposal(id: string): Observable<MessageEvent> {
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

    return proposal$.pipe(
      (source) => {
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
              ]).catch(() => null);

              return () => {
                proposal = null;
              };
            },
          });
        });
      },
      map((value) => ({
        data: {
          statusCode: STATUS_CODE.CONTINUE,
          proposal: value,
        },
      })),
      endWith(COMPLETED_MESSAGE_EVENT()),
      shareReplay(),
    );
  }

  /**
   * 出行计划列表（分页）
   */
  async touristPlans({
    pagination: { limit, page } = { limit: 10, page: 1 },
    filter,
  }: Query<FilterTouristPlansInput>) {
    const qb = this.touristPlanRepository
      .createQueryBuilder()
      .where('1 = 1')
      .andWhere('belong_to_id = :belongToId', {
        belongToId: filter?.belongToId,
      });

    return await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  /**
   * 生成出行方案
   */
  async generateTouristPlan(id: string) {
    const _touristPlan = await this.touristPlan(id);

    if (_touristPlan.proposal) {
      return _touristPlan.proposal;
    }

    const [cityNames, attractionNames] = await Promise.all([
      this.cityService
        .citiesByCodes(_touristPlan.cityCodes)
        .then((cities) => cities.map((city) => city.name)),
      this.attractionService
        .attractionsByCodes(_touristPlan.attractionCodes)
        .then((attractions) => attractions.map((item) => item.name)),
    ]);

    const {
      '0': [model, apiKey, baseURL],
      '1': prompt,
    } = await Promise.all([
      this.plutoClient.getConfigurations<[string, string, string]>([
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.ARK_CABIN_CAB_MODEL,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.ARK_CABIN_CAB_API_KEY,
        },
        {
          token: REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
          property: VOLC_ARK_PROPERTY_TOKENS.ARK_CABIN_CAB_BASE_URL,
        },
      ]),
      useProposalPrompt({
        cities: cityNames.join(','),
        depatureAt: dayjs(_touristPlan.depatureAt).format('YYYY-MM-DD'),
        duration: _touristPlan.duration,
        attractions: attractionNames.join(','),
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
   * 将出行计划文本解析为结构化数据，返回完整的出行计划
   */
  async parseTouristPlan(id: string): Promise<TouristPlan> {
    // 1. 查询出行计划，没有提案或已解析过的方案则直接返回
    const _touristPlan = await this.touristPlan(id);
    if (!_touristPlan?.proposal) return _touristPlan;
    if (_touristPlan.itinerary) return _touristPlan;

    // 2. 获取 LLM 配置
    const [model, apiKey, baseURL] = await this.plutoClient.getConfigurations<
      [string, string, string]
    >([
      {
        token: REGISTERED_CONFIGURATION_TOKENS.OPENAI,
        property: OPENAI_PROPERTY_TOKEN.MODEL,
      },
      {
        token: REGISTERED_CONFIGURATION_TOKENS.OPENAI,
        property: OPENAI_PROPERTY_TOKEN.API_KEY,
      },
      {
        token: REGISTERED_CONFIGURATION_TOKENS.OPENAI,
        property: OPENAI_PROPERTY_TOKEN.BASE_URL,
      },
    ]);

    // 3. 构建提示词，使用数据库中的 proposal 字段作为待解析文本
    const prompt = await useParseTextPrompt({
      text: _touristPlan.proposal,
    });

    // 4. 创建 LLM 实例并配置结构化输出
    const chat = new ChatOpenAI({
      model,
      configuration: {
        baseURL,
        apiKey,
      },
    });

    const structuredLlm = chat.withStructuredOutput(ITINERARY_SCHEMA, {
      method: 'functionCalling',
      name: 'parseResult',
    });

    // 5. 调用大模型获取结构化结果
    const result = await structuredLlm.invoke(prompt);

    // 6. 将解析结果存入数据库
    await this.touristPlanRepository.update(id, {
      itinerary: result,
    });

    // 7. 返回完整的出行计划数据
    return await this.touristPlan(id);
  }

  /**
   * 创建出行方案
   */
  async create(input: CreateTouristPlanInput) {
    await this.userService.isQuotaOverflow(input.belongToId);

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
          throw new BadRequestException('Tourist plan not found');
        }

        return _touristPlan;
      });
  }
}

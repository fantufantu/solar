/// <reference types="jest" />
import { ChatOpenAI } from '@langchain/openai';
import { AIMessageChunk } from '@langchain/core/messages';
import { lastValueFrom, toArray } from 'rxjs';
import { TouristPlanService } from './tourist-plan.service';

jest.mock('@langchain/openai', () => ({ ChatOpenAI: jest.fn() }));

describe('TouristPlanService proposal streaming', () => {
  it('streams and persists text from Responses content blocks', async () => {
    const repository = { update: jest.fn().mockResolvedValue(undefined) };
    const service = new TouristPlanService(
      {} as any,
      repository as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    jest.spyOn(service, 'generateTouristPlan').mockResolvedValue(
      (async function* () {
        yield new AIMessageChunk({
          content: [{ type: 'text', text: '第一天' }],
        });
        yield new AIMessageChunk({
          content: [{ type: 'text', text: '游览故宫' }],
        });
      })() as any,
    );

    const events = await lastValueFrom(
      service.proposal('plan-1').pipe(toArray()),
    );

    expect(
      events.slice(0, 2).map((event) => (event.data as any).proposal),
    ).toEqual(['第一天', '游览故宫']);
    expect(repository.update).toHaveBeenCalledWith('plan-1', {
      proposal: '第一天游览故宫',
    });
  });
});

it('groups attractions by district code regardless of query result order', async () => {
  const stream = jest.fn().mockResolvedValue('stream');
  (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({ stream }));
  const service = new TouristPlanService(
    { getConfigurations: async () => ['model', 'key', 'url'] } as any,
    {
      findOneBy: async () => ({
        districtCodes: ['bj', 'hz'],
        attractionCodes: ['gg', 'xh'],
        depatureAt: '2026-11-01',
        duration: 3,
      }),
    } as any,
    {} as any,
    {
      districtsByCodes: async () => [
        { code: 'hz', name: '杭州' },
        { code: 'bj', name: '北京' },
      ],
    } as any,
    {
      attractionsByCodes: async () => [
        { code: 'xh', name: '西湖', districtCode: 'hz' },
        { code: 'gg', name: '故宫', districtCode: 'bj' },
      ],
    } as any,
    {} as any,
    {} as any,
  );
  await service.generateTouristPlan('plan-1');
  const message = stream.mock.calls[0][0].toChatMessages()[1].text;
  const destinations = JSON.parse(
    message.split('目的地与意向景点（JSON）：\n')[1].split('\n\n')[0],
  );
  expect(destinations).toEqual([
    { code: 'bj', name: '北京', attractions: [{ code: 'gg', name: '故宫' }] },
    { code: 'hz', name: '杭州', attractions: [{ code: 'xh', name: '西湖' }] },
  ]);
});

it.each([
  { districtCodes: [], attractionCodes: [], districts: [], attractions: [] },
  {
    districtCodes: ['bj'],
    attractionCodes: [],
    districts: [],
    attractions: [],
  },
  {
    districtCodes: ['bj'],
    attractionCodes: ['missing'],
    districts: [{ code: 'bj', name: '北京' }],
    attractions: [],
  },
  {
    districtCodes: ['bj'],
    attractionCodes: ['xh'],
    districts: [{ code: 'bj', name: '北京' }],
    attractions: [{ code: 'xh', name: '西湖', districtCode: 'hz' }],
  },
])(
  'rejects missing or mismatched destinations and attractions: %j',
  async (fixture) => {
    const getConfigurations = jest.fn();
    const service = new TouristPlanService(
      { getConfigurations } as any,
      { findOneBy: async () => fixture } as any,
      {} as any,
      { districtsByCodes: async () => fixture.districts } as any,
      { attractionsByCodes: async () => fixture.attractions } as any,
      {} as any,
      {} as any,
    );
    await expect(service.generateTouristPlan('plan-1')).rejects.toThrow();
    expect(getConfigurations).not.toHaveBeenCalled();
  },
);

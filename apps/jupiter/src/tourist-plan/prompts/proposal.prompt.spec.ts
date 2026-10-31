/// <reference types="jest" />
import { useProposalPrompt } from './proposal.prompt';

it('preserves each destination and its selected attractions in the human message', async () => {
  const prompt = await useProposalPrompt({
    destinations: [
      { code: 'bj', name: '北京', attractions: [{ code: 'gg', name: '故宫' }] },
      { code: 'hz', name: '杭州', attractions: [] },
    ],
    depatureAt: '2026-11-01',
    duration: 3,
  });
  const messages = prompt.toChatMessages();
  expect(messages.map((message) => message.type)).toEqual(['system', 'human']);
  expect(messages[1].text).toContain('出发日期：2026-11-01');
  expect(messages[1].text).toContain('行程总天数：3天');
  expect(
    JSON.parse(
      messages[1].text
        .split('目的地与意向景点（JSON）：\n')[1]
        .split('\n\n')[0],
    ),
  ).toEqual([
    { code: 'bj', name: '北京', attractions: [{ code: 'gg', name: '故宫' }] },
    { code: 'hz', name: '杭州', attractions: [] },
  ]);
});

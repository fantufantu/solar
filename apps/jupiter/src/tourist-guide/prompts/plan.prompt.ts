import { ChatPromptTemplate } from '@langchain/core/prompts';

interface UsingPlanPrompt {
  cities: string;
  depatureAt: string;
  duration: number;
  attractions: string;
}

export const usePlanPrompt = (input: UsingPlanPrompt) => {
  const template = ChatPromptTemplate.fromMessages([
    ChatPromptTemplate.fromTemplate(
      '为我规划一个前往{cities}的计划，于{depatureAt}出发，为期{duration}天，前往景点列表为{attractions}',
    ),
  ]);

  return template.invoke(input);
};

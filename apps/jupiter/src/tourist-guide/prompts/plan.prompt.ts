import { ChatPromptTemplate } from '@langchain/core/prompts';
import { PlanInput } from '../dto/plan.input';

export const usePlanPrompt = (input: PlanInput) => {
  const template = ChatPromptTemplate.fromMessages([
    ChatPromptTemplate.fromTemplate(
      '为我规划一个前往{position}的计划，为期{duration}天，前往景点列表为{places}',
    ),
  ]);

  return template.invoke(input);
};

import { ChatPromptTemplate } from '@langchain/core/prompts';

interface UseParseTextPromptInput {
  text: string;
  instruction?: string;
}

export const useParseTextPrompt = (input: UseParseTextPromptInput) => {
  const systemMessage = input.instruction
    ? `你是一个文本解析助手。根据用户的额外指示，从以下文本中提取信息并按照给定的 JSON Schema 输出。只输出符合 schema 的 JSON 对象，不要包含其他内容。\n\n额外指示：${input.instruction}`
    : '你是一个文本解析助手。从以下文本中提取结构化信息，并按照给定的 JSON Schema 输出。只输出符合 schema 的 JSON 对象，不要包含其他内容。';

  const template = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    ['human', '请解析以下文本，严格按照指定的 JSON Schema 格式输出：\n\n{text}'],
  ]);

  return template.invoke(input);
};

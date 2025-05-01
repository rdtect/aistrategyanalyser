// Utility to extract and construct a system prompt from category/question prompt data
import categoryQuestionPrompts from '../../data/category_question_prompts.json';

export type PromptSection = 'Role Definition' | 'Task Description' | 'Output Format' | 'Style Guidelines' | 'Constraints' | 'Interactivity';

export interface PromptObject {
  [section: string]: string;
}

export function getSystemPromptFromQuestion(category: string, questionId: string, sections: PromptSection[] = [
  'Role Definition', 'Task Description', 'Output Format', 'Style Guidelines', 'Constraints', 'Interactivity']): string {
  const questions = (categoryQuestionPrompts as any)[category] as Array<any>;
  if (!questions) return '';
  const questionObj = questions.find(q => q.id === questionId);
  if (!questionObj || !questionObj.prompt) return '';
  const prompt: PromptObject = questionObj.prompt;
  // Concatenate selected sections, separated by double line breaks
  return sections
    .map(section => prompt[section] ? `${section}:\n${prompt[section]}` : '')
    .filter(Boolean)
    .join('\n\n');
}

// Fallback: load the average system prompt as a string
export async function getAverageSystemPrompt(): Promise<string> {
  const res = await fetch('/src/routes/chats/(lib)/data/average_system_prompt.txt');
  return await res.text();
}

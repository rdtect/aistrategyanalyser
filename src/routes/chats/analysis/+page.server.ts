import type { Actions, PageServerLoad } from "./$types";
import { categoryQuestionsData } from "../(lib)/data/category_question_prompts";

// Clean up: Remove commented-out code, clarify purpose
// Loads categoryQuestionsData for analysis creation
export const load: PageServerLoad = async () => {
  return {
    categories: categoryQuestionsData,
  };
};
// TODO: Add actions if analysis creation requires backend persistence

import type { Actions, PageServerLoad } from "./$types";
// Remove unused imports
// import { fail, json } from "@sveltejs/kit";
import { categoryQuestionsData } from "$lib/data/category_question_prompts";
// import { v4 as uuidv4 } from "uuid";

export const load: PageServerLoad = async () => {
  return {
    categories: categoryQuestionsData,
  };
};

// Remove the entire actions export if it becomes empty
// export const actions: Actions = {
//   createChat: async ({ request }) => {
//     // ... removed code ...
//   },
// };

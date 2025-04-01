import categoryData from "./category_question_prompts.json";

// Define interfaces based on the JSON structure
interface PromptDetail {
  "Role Definition"?: string;
  "Task Description"?: string;
  "Output Format"?: string;
  "Style Guidelines"?: string;
  Constraints?: string;
  Interactivity?: string;
  // Include 12-Box method specific fields if they always exist
  "Audience Identification"?: string;
  "Purpose Clarification"?: string;
  "Constraints and Requirements"?: string;
  "Source Specification"?: string;
  "Style and Tone Guidelines"?: string;
  "Evidence Linking"?: string;
  "Verification Steps"?: string;
  "Iterative Refinement"?: string;
  "Feedback Incorporation"?: string;
}

interface Question {
  id: string;
  question: string;
  method: string;
  prompt: PromptDetail;
}

interface CategoryQuestions {
  [category: string]: Question[];
}

// Assert the type of the imported JSON data
const typedCategoryData: CategoryQuestions = categoryData;

// Export the typed data
export const categoryQuestionsData: CategoryQuestions = typedCategoryData;

// Optional: Export types if needed elsewhere
export type { CategoryQuestions, Question, PromptDetail };

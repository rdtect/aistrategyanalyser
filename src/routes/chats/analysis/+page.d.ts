// Import the type for categories data
import type { CategoryQuestions } from "$lib/data/category_question_prompts";
// Import types for layout data (adjust path and types as necessary based on actual $lib definitions)
import type { Chat } from "$lib/types"; // Assuming Chat type is defined in $lib/types

// Define the expected PageData structure (returned by load + inherited from layout)
export interface PageData {
  categories: CategoryQuestions;
  sampleChats: Chat[]; // Assuming sampleChats uses the Chat type
  timestamp: number; // Add timestamp from layout
}

// Define the expected form data structure for the page (returned by actions)
export interface ActionData {
  error?: string;
  values?: {
    name?: string;
    company?: string;
    industry?: string;
    region?: string;
  };
}

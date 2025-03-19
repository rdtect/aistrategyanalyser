export interface CategoryQuestion {
  category: string;
  questions: string[];
}

export const categoryQuestions: CategoryQuestion[] = [
  {
    category: "Market Analysis",
    questions: [
      "What are the key market trends?",
      "Who are the main competitors?",
      "What is the market size and growth rate?"
    ]
  },
  {
    category: "Customer Segments",
    questions: [
      "Who are the target customers?",
      "What are their pain points?",
      "What is their buying behavior?"
    ]
  }
  // Add more categories and questions as needed
];
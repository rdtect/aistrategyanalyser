import type { Actions } from "@sveltejs/kit";
import { fail, json } from "@sveltejs/kit";
import categoryQuestionPrompts from "$lib/data/category_question_prompts.json";
import { v4 as uuidv4 } from "uuid";

export const actions: Actions = {
  createChat: async ({ request }) => {
    try {
      // Get form data
      const formData = await request.formData();
      const name = formData.get("name")?.toString() || "";
      const company = formData.get("company")?.toString() || "";
      const industry = formData.get("industry")?.toString() || "";
      const region = formData.get("region")?.toString() || "";
      const additionalInfo = formData.get("context")?.toString() || "";

      // Get selected questions
      let selectedQuestions: string[] = [];
      try {
        const questionsData = formData.get("selectedQuestions")?.toString();
        if (questionsData) {
          selectedQuestions = JSON.parse(questionsData);
        }
      } catch (e) {
        console.error("Error parsing selected questions:", e);
      }

      // Validate required fields
      if (!name.trim()) {
        return fail(400, {
          error: "Analysis name is required",
          values: { name, company, industry, region },
        });
      }

      // Generate a unique chat ID
      const chatId = uuidv4();
      console.log(`[Server] Creating new chat with ID: ${chatId}`);

      // Generate initial message content
      let initialMessage = `# Analysis: ${name}\n\n`;
      initialMessage += `## Company Information\n`;
      initialMessage += `- Company: ${company}\n`;
      initialMessage += `- Industry: ${industry}\n`;
      initialMessage += `- Region: ${region}\n\n`;

      if (additionalInfo) {
        initialMessage += `## Additional Context\n${additionalInfo}\n\n`;
      }

      // Add selected questions
      if (selectedQuestions.length > 0) {
        initialMessage += `## Selected Questions\n`;

        for (const questionId of selectedQuestions) {
          // Find question in category prompts
          let questionText = "Unknown question";

          for (const [category, questions] of Object.entries(
            categoryQuestionPrompts,
          )) {
            const question = questions.find((q) => q.id === questionId);
            if (question) {
              questionText = question.question;
              break;
            }
          }

          initialMessage += `- ${questionText}\n`;
        }
      }

      // Create context object for the new structure
      const context = {
        company,
        industry,
        region,
        additionalInfo,
      };

      // Create timestamp for creation
      const timestamp = new Date().toISOString();

      // Create a complete response object
      const responseData = {
        success: true,
        chatId,
        name,
        context,
        createdAt: timestamp,
        updatedAt: timestamp,
        initialMessage,
      };

      console.log(`[Server] Created chat: ${chatId} - ${name}`);

      // Return the response data
      return responseData;
    } catch (error) {
      console.error("Error creating chat:", error);
      return fail(500, {
        error: "Failed to create analysis. Please try again.",
      });
    }
  },
};

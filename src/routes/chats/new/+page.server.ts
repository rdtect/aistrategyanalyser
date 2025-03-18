import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { sampleChats, sampleMessages } from "$lib/data/sampleData";
import categoryQuestionPrompts from "$lib/data/category_question_prompts.json";

// For POC, we'll use in-memory data instead of Prisma
let nextChatId = "4"; // Start after our sample chats

export const actions: Actions = {
  createChat: async ({ request }) => {
    try {
      // Get form data
      const formData = await request.formData();
      const name = formData.get("name")?.toString() || "";
      const company = formData.get("company")?.toString() || "";
      const industry = formData.get("industry")?.toString() || "";
      const region = formData.get("region")?.toString() || "";
      const context = formData.get("context")?.toString() || "";

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

      // For POC: Create a new chat in sample data
      const chatId = nextChatId;
      nextChatId = String(parseInt(nextChatId) + 1);

      // Add to sample chats
      sampleChats.push({
        id: chatId,
        name,
        createdAt: new Date(),
        company,
        industry,
        region,
      });

      // Generate initial message content
      let initialMessage = `# Analysis: ${name}\n\n`;
      initialMessage += `## Company Information\n`;
      initialMessage += `- Company: ${company}\n`;
      initialMessage += `- Industry: ${industry}\n`;
      initialMessage += `- Region: ${region}\n\n`;

      if (context) {
        initialMessage += `## Additional Context\n${context}\n\n`;
      }

      // Add selected questions
      if (selectedQuestions.length > 0) {
        initialMessage += `## Selected Questions\n`;

        for (const questionId of selectedQuestions) {
          // Find question in category prompts
          let questionText = "Unknown question";

          for (const [category, questions] of Object.entries(
            categoryQuestionPrompts
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

      // Create initial message thread
      (
        sampleMessages as Record<
          string,
          Array<{
            id: string;
            content: string;
            sender: string;
            timestamp: Date;
            status: string;
          }>
        >
      )[chatId] = [
        {
          id: `${chatId}01`,
          content: initialMessage,
          sender: "ai",
          timestamp: new Date(),
          status: "sent",
        },
      ];

      // Return chat ID for client-side navigation and processing
      return { chatId };
    } catch (error) {
      console.error("Error creating chat:", error);
      return fail(500, {
        error: "Failed to create analysis. Please try again.",
      });
    }
  },
};

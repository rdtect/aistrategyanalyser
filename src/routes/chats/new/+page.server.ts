import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const actions: Actions = {
  createChat: async ({ request }) => {
    try {
      // Get form data
      const formData = await request.formData();
      const name = formData.get("name")?.toString() || "";
      const company = formData.get("company")?.toString() || "";
      const industry = formData.get("industry")?.toString() || "";
      const region = formData.get("region")?.toString() || "";

      // Validate required fields
      if (!name.trim()) {
        return fail(400, {
          error: "Analysis name is required",
          values: { name, company, industry, region },
        });
      }

      // Create chat in database
      const chat = await prisma.chat.create({
        data: {
          name,
        },
      });

      // Create analysis with additional data
      if (company || industry || region) {
        await prisma.analysis.create({
          data: {
            company: company || "Unknown",
            industry: industry || "Unknown",
            region: region || "Global",
            chatId: chat.id,
          },
        });
      }

      // Redirect to the new chat
      return redirect(303, `/chats/${chat.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      return fail(500, {
        error: "Failed to create analysis. Please try again.",
      });
    }
  },
};

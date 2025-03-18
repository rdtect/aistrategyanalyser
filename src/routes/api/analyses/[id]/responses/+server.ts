import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db";

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const { responses, chatId } = await request.json();

    // Validate
    if (!responses || !Array.isArray(responses)) {
      return json({ error: "Responses array is required" }, { status: 400 });
    }

    // Batch responses in groups of 100 for better performance
    const BATCH_SIZE = 100;
    for (let i = 0; i < responses.length; i += BATCH_SIZE) {
      const batch = responses.slice(i, i + BATCH_SIZE);

      await prisma.analysisResponse.createMany({
        data: batch.map((r) => ({
          analysisId: id,
          questionId: r.id,
          content: r.answer,
        })),
      });
    }

    // Update analysis status and link to chat
    await prisma.analysis.update({
      where: { id },
      data: {
        status: "COMPLETED",
        chatId,
      },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error saving responses:", error);
    return json({ error: "Failed to save responses" }, { status: 500 });
  }
};

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/_archived/lib/server/db";

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const { questions } = await request.json();

    // Validate
    if (!questions || !Array.isArray(questions)) {
      return json({ error: "Questions array is required" }, { status: 400 });
    }

    // Get analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      return json({ error: "Analysis not found" }, { status: 404 });
    }

    // Save questions
    await prisma.analysisQuestion.createMany({
      data: questions.map((q) => ({
        analysisId: id,
        questionId: q.id,
        question: q.question,
        prompt: q.prompt,
      })),
    });

    // Update analysis status
    await prisma.analysis.update({
      where: { id },
      data: { status: "QUESTIONS_SELECTED" },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error saving questions:", error);
    return json({ error: "Failed to save questions" }, { status: 500 });
  }
};

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/_archived/lib/server/db";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { company, industry, region, additionalContext } =
      await request.json();

    // Validate required fields
    if (!company || !industry) {
      return json(
        { error: "Company and industry are required" },
        { status: 400 },
      );
    }

    // Create analysis
    const analysis = await prisma.analysis.create({
      data: {
        company,
        industry,
        region,
        additionalContext,
        status: "CREATED",
        createdAt: new Date(),
      },
    });

    return json({ id: analysis.id });
  } catch (error) {
    console.error("Error creating analysis:", error);
    return json({ error: "Failed to create analysis" }, { status: 500 });
  }
};

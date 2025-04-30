import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  // Return a basic list of models
  return json({
    data: [
      { id: "gpt-4", name: "GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
  });
}

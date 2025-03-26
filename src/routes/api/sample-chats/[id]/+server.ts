import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateUuidParam } from "$lib/utils";

// Add a few sample chats that can be used as fallbacks
const sampleChats = {
  "c8f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f": {
    id: "c8f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
    name: "Tesla Strategy Review",
    createdAt: "2023-11-03T09:15:00.000Z",
    updatedAt: "2025-03-25T10:56:48.608Z",
    context: {
      company: "Tesla",
      industry: "Automotive & Energy",
      region: "Global",
      additionalInfo: "",
    },
    messages: [
      {
        id: "m5f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 0,
        sender: "user",
        content:
          "How is Tesla positioning itself beyond electric vehicles? What strategic moves are they making in other sectors?",
        timestamp: "2023-11-03T09:16:00.000Z",
        status: "sent",
      },
      {
        id: "m6f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 1,
        sender: "ai",
        content:
          "# Tesla's Strategic Positioning Beyond EVs\n\n## Energy Generation & Storage\n\n### Solar Products\n- **Solar Roof**: Premium integrated solar tiles for new construction and roof replacements\n- **Solar Panels**: Traditional panels for existing roofs\n- **Strategy**: Positioning as end-to-end clean energy provider, though solar deployment has faced challenges and slower growth\n\n### Battery Storage\n- **Powerwall**: Home battery system\n- **Powerpack/Megapack**: Commercial and utility-scale storage\n- **Strategy**: Creating energy ecosystem with potential for virtual power plants; addressing grid stability concerns\n\n## AI & Robotics\n\n### Full Self-Driving (FSD)\n- Moving beyond driver assistance to autonomous capability\n- Building massive real-world data advantage through fleet learning\n- **Strategy**: Potential for robotaxi network and transportation-as-a-service platform\n\n### Tesla Bot (Optimus)\n- Humanoid robot for dangerous/repetitive tasks\n- Leveraging FSD AI systems for general-purpose applications\n- **Strategy**: Long-term play to address labor shortages and create new product category\n\n## Computing & Software\n\n### Custom Silicon\n- Developing specialized AI chips (Dojo) for training self-driving models\n- Vertical integration of computing hardware\n- **Strategy**: Building competitive advantages in AI processing efficiency\n\n### In-Car Software & Subscriptions\n- Expanding subscription services and software features\n- **Strategy**: High-margin recurring revenue streams and improved customer lifetime value\n\n## Strategic Challenges\n\n1. **Focus Concerns**: Investor worries about resource allocation to non-core ventures\n2. **Execution Timelines**: History of optimistic predictions about autonomous capabilities\n3. **Competitive Response**: Legacy OEMs accelerating EV transitions and new entrants in key markets\n4. **Regulatory Environment**: Increased scrutiny of autonomous systems and data practices\n\nWould you like me to expand on any particular aspect of Tesla's diversification strategy?",
        timestamp: "2023-11-03T09:17:00.000Z",
        status: "sent",
      },
    ],
  },
  "43c13d40-4a18-4a6e-a062-835893dd0d16": {
    id: "43c13d40-4a18-4a6e-a062-835893dd0d16",
    name: "Nike | Footwear | Consumer Analysis",
    messages: [
      {
        id: "72a616b7-6433-46c5-b431-9e61fe353f4e",
        sender: "system",
        content:
          "You are an AI Strategy Analyst assistant analyzing Nike in the footwear industry.",
        timestamp: "2025-03-25T11:13:04.124Z",
        status: "sent",
        index: 0,
      },
      {
        id: "6004f5f2-e6fc-45ee-8a20-97b1bfe7ba56",
        sender: "ai",
        content:
          "# Welcome to your strategic analysis for Nike!\n\n## Context Information\n- Company: Nike\n- Industry: Footwear\n- Region: Global\n\n## Selected Questions for Analysis\n\n### Consumer Analysis\n- What are the key demographics of our target consumers?\n- What are the main needs and pain points of our customers?\n- How do consumer buying behaviors influence our product strategy?\n- What trends are emerging in consumer preferences in our industry?\n- How do consumers perceive our brand compared to competitors?\n\n## What would you like to explore first?\n1. SWOT Analysis\n2. Market positioning\n3. Competitive landscape\n4. Growth opportunities",
        timestamp: "2025-03-25T11:13:04.953Z",
        status: "sent",
        index: 1,
      },
    ],
    createdAt: "2025-03-25T11:13:04.124Z",
    updatedAt: "2025-03-25T11:13:04.953Z",
    context: {
      company: "Nike",
      industry: "Footwear",
      region: "Global",
      additionalInfo: "",
      competitors: [],
    },
  },
};

export const GET: RequestHandler = async ({ params }) => {
  const chatId = validateUuidParam(params);

  if (!chatId) {
    return new Response("Invalid chat ID", { status: 400 });
  }

  try {
    // Check if we have this sample chat
    if (chatId in sampleChats) {
      return json(sampleChats[chatId]);
    }

    return new Response("Sample chat not found", { status: 404 });
  } catch (error) {
    console.error(`Error fetching sample chat ${chatId}:`, error);
    return new Response("Internal server error", { status: 500 });
  }
};

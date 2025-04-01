// Import canonical types from the new central location
import type { Chat, Message, ChatContext } from "$lib/types";

/**
 * Sample chat data for demonstration purposes
 * This is the single source of truth for sample data
 */
export const sampleChats: Chat[] = [
  {
    id: "c8f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
    name: "Nike Strategic Plan",
    createdAt: "2023-11-01T10:00:00.000Z",
    updatedAt: "2023-11-01T10:00:00.000Z",
    context: {
      id: "context-nike-swot",
      name: "Nike Context",
      company: "Nike",
      industry: "Sportswear",
      region: "Global",
      additionalInfo: "",
    },
    messages: [
      {
        id: "m1f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 0,
        role: "user",
        content:
          "Can you analyze Nike's current business strategy and suggest improvements?",
        timestamp: "2023-11-01T10:01:00.000Z",
        status: "sent",
      },
      {
        id: "m2f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 1,
        role: "assistant",
        content:
          "# Nike Business Strategy Analysis\n\n## Current Strategy\nNike's current strategy focuses on:\n\n1. **Direct-to-Consumer (DTC)** - Reducing reliance on third-party retailers\n2. **Digital Transformation** - Enhancing online sales and customer experience\n3. **Innovation** - Continuing product development and technological integration\n4. **Market Segmentation** - Targeting specific consumer groups\n5. **Sustainability** - Implementing eco-friendly practices\n\n## Suggested Improvements\n\n### 1. Accelerate Metaverse Integration\nNike has begun exploring NFTs and virtual products through RTFKT acquisition, but could expand its \"Nike Virtual Studios\" division to create more immersive experiences.\n\n### 2. Enhance Personalization\nLeverage AI and data analytics to offer more personalized products and recommendations, potentially expanding the Nike By You customization platform.\n\n### 3. Strengthen Supply Chain Resilience\nRecent disruptions have highlighted vulnerabilities. Diversifying manufacturing beyond Southeast Asia could mitigate future risks.\n\n### 4. Expand Health Ecosystem\nIntegrate Nike's digital apps (Training Club, Run Club) with health monitoring devices and services to create a comprehensive wellness platform.\n\n### 5. Targeted Subscription Models\nTest subscription services for specific segments - children's footwear (addressing fast growth), performance athletes (regular equipment upgrades), etc.\n\nWould you like me to expand on any of these areas?",
        timestamp: "2023-11-01T10:01:30.000Z",
        status: "sent",
      },
    ],
  },
  {
    id: "c9f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
    name: "Starbucks Growth",
    createdAt: "2023-11-02T14:30:00.000Z",
    updatedAt: "2023-11-02T14:30:00.000Z",
    context: {
      id: "context-starbucks-market",
      name: "Starbucks Context",
      company: "Starbucks",
      industry: "Food & Beverage",
      region: "North America",
      additionalInfo: "",
    },
    messages: [
      {
        id: "m3f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 0,
        role: "user",
        content:
          "What are Starbucks' key challenges in the current market and how can they maintain growth?",
        timestamp: "2023-11-02T14:31:00.000Z",
        status: "sent",
      },
      {
        id: "m4f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 1,
        role: "assistant",
        content:
          "# Starbucks: Key Challenges & Growth Strategies\n\n## Current Challenges\n\n### 1. Market Saturation\nIn mature markets like the US, Starbucks faces location saturation and cannibalization of sales between nearby stores.\n\n### 2. Increased Competition\nBoth from specialty coffee chains (Blue Bottle, Intelligentsia) and fast-food chains improving their coffee offerings (McDonald's, Dunkin').\n\n### 3. Price Sensitivity\nInflation and economic uncertainty are making consumers more price-conscious about premium beverages.\n\n### 4. Labor Issues\nIncreasing unionization efforts, labor costs, and staff retention challenges affect operations.\n\n### 5. Changing Consumer Preferences\nShifts toward health-conscious options and sustainable practices require menu and operations adaptations.\n\n## Growth Strategies\n\n### 1. Experience-Led Concept Stores\nExpand Reserve Roasteries and Starbucks Pickup locations to differentiate through premium experiences or convenience.\n\n### 2. International Expansion Focus\nAccelerate growth in underpenetrated markets like China, India, and Southeast Asia with locally-tailored offerings.\n\n### 3. Digital Ecosystem Enhancement\nFurther develop the mobile app to increase personalization, introduce gamification elements, and create digital-only promotions.\n\n### 4. Product Innovation Pipeline\nIntroduce more plant-based options, functional beverages (adaptogenic, nootropic), and expand ready-to-drink retail partnerships.\n\n### 5. Subscription Evolution\nExpand subscription services beyond coffee beans to include in-store benefits and exclusive products.\n\n### 6. Delivery Integration\nOptimize operations for delivery without compromising in-store experience, potentially with dedicated production lines for digital orders.\n\nWould you like me to elaborate on any particular challenge or strategy?",
        timestamp: "2023-11-02T14:32:00.000Z",
        status: "sent",
      },
    ],
  },
  {
    id: "c0f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
    name: "Tesla Strategy Review",
    createdAt: "2023-11-03T09:15:00.000Z",
    updatedAt: "2023-11-03T09:15:00.000Z",
    context: {
      id: "context-tesla-comp",
      name: "Tesla Context",
      company: "Tesla",
      industry: "Automotive & Energy",
      region: "Global",
      additionalInfo: "",
    },
    messages: [
      {
        id: "m5f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 0,
        role: "user",
        content:
          "How is Tesla positioning itself beyond electric vehicles? What strategic moves are they making in other sectors?",
        timestamp: "2023-11-03T09:16:00.000Z",
        status: "sent",
      },
      {
        id: "m6f7f3e0-0d1e-4f1f-9c1c-3b2d1d2e3f4f",
        index: 1,
        role: "assistant",
        content:
          "# Tesla's Strategic Positioning Beyond EVs\n\n## Energy Generation & Storage\n\n### Solar Products\n- **Solar Roof**: Premium integrated solar tiles for new construction and roof replacements\n- **Solar Panels**: Traditional panels for existing roofs\n- **Strategy**: Positioning as end-to-end clean energy provider, though solar deployment has faced challenges and slower growth\n\n### Battery Storage\n- **Powerwall**: Home battery system\n- **Powerpack/Megapack**: Commercial and utility-scale storage\n- **Strategy**: Creating energy ecosystem with potential for virtual power plants; addressing grid stability concerns\n\n## AI & Robotics\n\n### Full Self-Driving (FSD)\n- Moving beyond driver assistance to autonomous capability\n- Building massive real-world data advantage through fleet learning\n- **Strategy**: Potential for robotaxi network and transportation-as-a-service platform\n\n### Tesla Bot (Optimus)\n- Humanoid robot for dangerous/repetitive tasks\n- Leveraging FSD AI systems for general-purpose applications\n- **Strategy**: Long-term play to address labor shortages and create new product category\n\n## Computing & Software\n\n### Custom Silicon\n- Developing specialized AI chips (Dojo) for training self-driving models\n- Vertical integration of computing hardware\n- **Strategy**: Building competitive advantages in AI processing efficiency\n\n### In-Car Software & Subscriptions\n- Expanding subscription services and software features\n- **Strategy**: High-margin recurring revenue streams and improved customer lifetime value\n\n## Strategic Challenges\n\n1. **Focus Concerns**: Investor worries about resource allocation to non-core ventures\n2. **Execution Timelines**: History of optimistic predictions about autonomous capabilities\n3. **Competitive Response**: Legacy OEMs accelerating EV transitions and new entrants in key markets\n4. **Regulatory Environment**: Increased scrutiny of autonomous systems and data practices\n\nWould you like me to expand on any particular aspect of Tesla's diversification strategy?",
        timestamp: "2023-11-03T09:17:00.000Z",
        status: "sent",
      },
    ],
  },
];

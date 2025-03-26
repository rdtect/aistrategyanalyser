/**
 * AI Models Configuration
 *
 * This file defines the available AI models that can be used in the application.
 */

export type AIModel = "gpt-4" | "gpt-3.5-turbo" | "gemini-pro";

export interface AIModelConfig {
  name: string;
  description: string;
  maxTokens: number;
  provider: "openai" | "google" | "anthropic";
  capabilities: string[];
}

/**
 * Available AI models with their configurations
 */
export const AI_MODELS: Record<AIModel, AIModelConfig> = {
  "gpt-4": {
    name: "GPT-4 (Recommended)",
    description: "OpenAI's most capable model for complex tasks",
    maxTokens: 8192,
    provider: "openai",
    capabilities: [
      "Advanced reasoning",
      "Detailed analysis",
      "Complex instructions",
      "Code generation",
    ],
  },
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    description: "Faster responses with good overall performance",
    maxTokens: 4096,
    provider: "openai",
    capabilities: [
      "Fast responses",
      "General questions",
      "Basic analysis",
      "Good balance of speed and quality",
    ],
  },
  "gemini-pro": {
    name: "Gemini Pro",
    description: "Google's multimodal model with up-to-date training",
    maxTokens: 8192,
    provider: "google",
    capabilities: [
      "Multimodal analysis",
      "Recent internet data",
      "Strong with technical and scientific content",
    ],
  },
};

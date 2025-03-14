export interface SearchPricing {
    low: number;
    medium: number;
    high: number;
}

export interface ModelPricing {
    input: number;
    output: number;
    search?: SearchPricing;
}

export const AI_MODELS = {
    'gpt-4o': {
        name: 'GPT-4o',
        pricing: {
            input: 0.01,    // $0.01 per 1K input tokens
            output: 0.03,   // $0.03 per 1K output tokens
            search: {
                low: 0.03,    // $30.00 per 1K calls
                medium: 0.035, // $35.00 per 1K calls
                high: 0.05    // $50.00 per 1K calls
            }
        },
        description: 'Our high-intelligence flagship model for complex, multi-step tasks. GPT-4o is cheaper and faster than GPT-4 Turbo.',
        contextWindow: 128000,
        maxOutputTokens: 4096
    },
    'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        pricing: {
            input: 0.0005,  // $0.0005 per 1K input tokens
            output: 0.0015, // $0.0015 per 1K output tokens
            search: {
                low: 0.025,    // $25.00 per 1K calls
                medium: 0.0275, // $27.50 per 1K calls
                high: 0.03     // $30.00 per 1K calls
            }
        },
        description: 'Our affordable and intelligent small model for fast, lightweight tasks. Cheaper and more capable than GPT-3.5 Turbo.',
        contextWindow: 128000,
        maxOutputTokens: 16384
    },
    'gpt-4o-search-preview': {
        name: 'GPT-4o Search',
        pricing: {
            input: 0.01,   // $0.01 per 1K input tokens
            output: 0.03,  // $0.03 per 1K output tokens
            search: {
                low: 0.03,    // $30.00 per 1K calls
                medium: 0.035, // $35.00 per 1K calls
                high: 0.05    // $50.00 per 1K calls
            }
        },
        description: 'GPT-4o optimized for web search capabilities.',
        contextWindow: 128000,
        maxOutputTokens: 4096
    },
    'gpt-4o-mini-search-preview': {
        name: 'GPT-4o Mini Search',
        pricing: {
            input: 0.0005,  // $0.0005 per 1K input tokens
            output: 0.0015, // $0.0015 per 1K output tokens
            search: {
                low: 0.025,    // $25.00 per 1K calls
                medium: 0.0275, // $27.50 per 1K calls
                high: 0.03     // $30.00 per 1K calls
            }
        },
        description: 'GPT-4o Mini optimized for web search capabilities.',
        contextWindow: 128000,
        maxOutputTokens: 16384
    }
} as const;

export type AIModel = keyof typeof AI_MODELS;

export type SearchContextSize = 'low' | 'medium' | 'high';

export const DEFAULT_SEARCH_CONTEXT_SIZE: SearchContextSize = 'medium';

// Helper function to calculate search cost
export function calculateSearchCost(
    model: AIModel, 
    contextSize: SearchContextSize = DEFAULT_SEARCH_CONTEXT_SIZE,
    calls: number = 1
): number {
    const searchPricing = AI_MODELS[model].pricing.search;
    if (!searchPricing) return 0;
    return searchPricing[contextSize] * calls;
}

// Helper function to calculate token cost
export function calculateTokenCost(
    model: AIModel,
    inputTokens: number,
    outputTokens: number
): number {
    const { input, output } = AI_MODELS[model].pricing;
    return (input * inputTokens + output * outputTokens) / 1000; // Convert to cost per 1K tokens
}
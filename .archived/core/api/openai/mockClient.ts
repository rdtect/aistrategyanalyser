import { browser } from "$app/environment";

let isInitialized = false;
let abortController: AbortController | null = null;

/**
 * Initialize the OpenAI client
 */
export function initialize(): void {
  if (isInitialized) return;
  isInitialized = true;
  
  if (browser) {
    // Nothing to initialize in the mock client
    console.log('Mock OpenAI client initialized');
  }
}

/**
 * Cancel any pending requests
 */
export function cancelRequest(): void {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Create a new OpenAI mock client instance
 */
export function createMockOpenAIClient() {
  if (browser) {
    initialize();
  }
  
  return {
    initialize,
    cancelRequest,
    
    /**
     * Generate a streaming response from the API
     */
    generateStreamingResponse: async (message: string, options = {}) => {
      // Create a mock streaming response
      abortController = new AbortController();
      
      return {
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('This is a mock response.'));
            controller.close();
          }
        }),
        cancel: cancelRequest
      };
    },
    
    /**
     * Check the health of the API connection
     */
    checkHealth: async (model = 'gpt-4') => {
      // Return mock health data
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        openai: {
          connected: true,
          model,
          error: undefined
        }
      };
    }
  };
}
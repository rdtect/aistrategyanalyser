/**
 * Mock service for development environments
 * Separates mock logic from production code for better maintainability
 */

/**
 * Create a mock streaming response
 */
export function createMockStreamResponse(message: string): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const response = `This is a mock response to: "${message}". In a production environment, this would be a streaming response from OpenAI.`;
      
      // Split the response into chunks to simulate streaming
      for (const chunk of response.split(' ')) {
        controller.enqueue(new TextEncoder().encode(chunk + ' '));
        await new Promise(r => setTimeout(r, 50)); // Simulate delay between chunks
      }
      
      controller.close();
    }
  });
}

/**
 * Create a mock non-streaming response
 */
export function createMockResponse(message: string, model: string = 'mock-model') {
  return {
    message: `This is a mock response to: "${message}"`,
    sources: [],
    model: model,
  };
}

/**
 * Determine if we should use mocks
 */
export function shouldUseMocks(apiKey?: string): boolean {
  return !apiKey || apiKey === 'mock-key-for-dev';
}

/**
 * Simulate processing delay
 */
export async function simulateProcessingDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function generateAIResponse(input: string, options: {
  model?: string;
  context?: unknown;
  signal?: AbortSignal;
}) {
  const response = await fetch('/api/ai/response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input,
      options: {
        model: options.model || 'gpt-4o',
        context: options.context
      }
    }),
    signal: options.signal
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate AI response');
  }

  return response.json();
}
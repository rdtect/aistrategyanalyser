import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

// Create OpenAI client with proper env variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
  // Get the messages from the request
  const { messages } = await request.json();

  // Request the OpenAI API for the response
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
    temperature: 0.7,
    stream: true,
  });

  // Create a ReadableStream from the OpenAI response
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });

  // Return the stream with appropriate headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
import { json } from '@sveltejs/kit';
import { generateAIResponse } from '$lib/services/aiService';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { message, context } = await request.json();
        const response = await generateAIResponse(message, context);
        
        return json({ response });
    } catch (error) {
        console.error('AI API Error:', error);
        return json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
};

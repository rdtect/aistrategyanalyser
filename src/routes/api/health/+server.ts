import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const model = url.searchParams.get('model') || 'gpt-4o-mini';
    
    try {
        // Your API health check logic here
        return json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            openai: {
                connected: true,
                model: model // Return the actual model being used
            }
        });
    } catch (error) {
        return json({
            status: 'error',
            timestamp: new Date().toISOString(),
            openai: {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }, { status: 500 });
    }
};

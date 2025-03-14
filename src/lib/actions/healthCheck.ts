import { browser } from '$app/environment';

export interface HealthStatus {
    isActive: boolean;
    lastChecked: string;
    openai?: {
        connected: boolean;
        model?: string;
        error?: string;
    };
    error?: string;
}

export async function checkHealth(): Promise<HealthStatus | null> {
    if (!browser) return null;
    
    try {
        const response = await fetch(new URL('/api/health', window.location.origin).href);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Health check failed');
        }
        
        return {
            isActive: data.status === 'ok',
            lastChecked: data.timestamp,
            openai: {
                connected: data.openai.connected,
                model: data.openai.model
            }
        };
    } catch (error) {
        return {
            isActive: false,
            lastChecked: new Date().toISOString(),
            openai: {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
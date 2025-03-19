import { browser } from "$app/environment";
import { createOpenAIClient } from "$lib/services/openaiClient.svelte";

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

/**
 * Create a reactive health check service using Svelte 5 runes
 */
export function createHealthCheck() {
  // State
  let status = $state<HealthStatus>({
    isActive: false,
    lastChecked: new Date().toISOString(),
    openai: {
      connected: false,
    },
  });
  let isChecking = $state(false);

  // OpenAI client
  let openaiClient = createOpenAIClient();

  /**
   * Check API health status
   */
  async function checkHealth(model = "gpt-4o"): Promise<HealthStatus> {
    if (!browser) {
      return status;
    }

    isChecking = true;

    try {
      const data = await openaiClient.checkHealth(model);

      status = {
        isActive: data.status === "ok",
        lastChecked: data.timestamp,
        openai: {
          connected: data.openai.connected,
          model: data.openai.model,
          error: data.openai.error,
        },
      };

      return status;
    } catch (error) {
      status = {
        isActive: false,
        lastChecked: new Date().toISOString(),
        openai: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      };

      return status;
    } finally {
      isChecking = false;
    }
  }

  // Auto-check health on initialization in browser environment
  if (browser) {
    setTimeout(() => checkHealth(), 1000);
  }

  return {
    get status() {
      return status;
    },
    get isChecking() {
      return isChecking;
    },
    checkHealth,
  };
}

import { browser } from "$app/environment";
// This import path was updated during refactoring
// import { createOpenAIClient } from "$lib/services/openaiClient.svelte";

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
 * @deprecated This file is archived and should not be used
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
  // let openaiClient = createOpenAIClient();
  const openaiClient = {
    checkHealth: async (model: string) => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        openai: {
          connected: true,
          model,
          error: undefined,
        },
      };
    },
  };

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

  // Removed automatic health check on initialization

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

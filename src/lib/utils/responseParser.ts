/**
 * Utility functions for parsing API responses
 */

export function extractContentFromResponse(response: any): string {
  return response?.output?.[0]?.content?.[0]?.text || "";
}

export function isSuccessfulResponse(response: any): boolean {
  return response?.status === "completed" && !response?.error;
}

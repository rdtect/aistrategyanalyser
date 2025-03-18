import { sampleChats } from "$lib/data/sampleData";

/** @type {import('./$types').PageLoad} */
export function load() {
  // Initial data from server side
  return {
    chats: sampleChats,
    timestamp: Date.now(), // Include a timestamp for client-side to track new chats
  };
}

/**
 * Utility to clean up and validate stored chats
 */
export function cleanupLocalStorage() {
  if (typeof localStorage === "undefined") return;

  try {
    // Load chats from localStorage
    const storedChatsJson = localStorage.getItem("userChats");
    if (!storedChatsJson) return;

    const storedChats = JSON.parse(storedChatsJson);
    if (!Array.isArray(storedChats)) {
      // If not an array, reset storage
      localStorage.setItem("userChats", JSON.stringify([]));
      return;
    }

    // Filter out invalid chats and fix those with missing IDs
    const validChats = storedChats
      .filter((chat) => chat && typeof chat === "object")
      .map((chat) => {
        if (!chat.id) {
          return { ...chat, id: crypto.randomUUID() };
        }
        return chat;
      });

    // Update localStorage
    localStorage.setItem("userChats", JSON.stringify(validChats));
    console.log(`Cleaned up localStorage: ${validChats.length} valid chats`);
  } catch (error) {
    console.error("Error cleaning up localStorage:", error);
    // In case of error, reset to empty array
    localStorage.setItem("userChats", JSON.stringify([]));
  }
}

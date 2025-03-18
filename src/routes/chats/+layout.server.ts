import type { LayoutServerLoad } from "./$types";
import { sampleChats } from "$lib/data/sampleData";

export const load: LayoutServerLoad = async () => {
  // Use sample data instead of Prisma
  return {
    chats: sampleChats
  };
};

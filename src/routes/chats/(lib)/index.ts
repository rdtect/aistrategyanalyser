/**
 * Chat Module Index
 *
 * This file exports functions and properties from the consolidated ChatManager.
 * It provides backward compatibility for code that uses the old API.
 * 
 * Deprecated index for Chat module. All consumers should import from ChatManager.svelte.ts directly.
 * This file is kept for backward compatibility only. No exports.
 */
import { chatManager } from "./ChatManager.svelte.ts";
import type { Chat, Message } from "../../../lib/types";

// Deprecated: Use direct imports from ChatManager and components instead.
export * from './ChatManager.svelte.ts';
// No addMessage export here. If you need addMessage, import from ChatManager directly.
// DO NOT export addMessage here.

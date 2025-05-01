<script lang="ts">
  import type { Chat } from "$lib/types";
  import IconHistory from "@lucide/svelte/icons/history";
  import IconPlus from "@lucide/svelte/icons/plus";
  import IconSearch from "@lucide/svelte/icons/search";
  import IconSettings from "@lucide/svelte/icons/settings";
  import { chatManager } from '../ChatManager.svelte.ts';

  // PROPS: Accept external props for chats, activeChatId, and handlers
  let { chats, activeChatId, onDeleteChat, onSelectChat, onCreateChat } = $props<{
    chats: Chat[];
    activeChatId: string | null;
    onDeleteChat: (id: string) => void;
    onSelectChat: (id: string) => void;
    onCreateChat: () => void;
  }>();
</script>

<aside class="glass-surface w-64 p-4 flex flex-col gap-2 h-full min-h-0 max-h-none flex-1">
  <header
    class="p-2 border-b border-surface-500/20 flex justify-between items-center"
  >
    <div class="flex items-center gap-2">
      <IconHistory size={16} class="text-primary-500" />
      <h3 class="text-sm font-medium">Analysis History</h3>
    </div>

    <button
      onclick={onCreateChat}
      class="btn btn-sm glass-primary"
      title="Create New Analysis"
      aria-label="Create New Analysis"
    >
      <IconPlus size={16} />
    </button>
  </header>

  <div class="p-1 border-b border-surface-500/30 relative">
    <div
      class="input-group input-group-divider grid-cols-[auto_1fr] rounded-container-token h-8"
    >
      <label
        for="search"
        class="ig-cell preset-tonal flex items-center justify-center"
      >
        <IconSearch size={14} />
      </label>
      <input
        id="search"
        type="search"
        class="ig-input glass-surface text-xs"
        placeholder="Search analyses..."
        aria-label="Search analyses"
      />
    </div>
  </div>

  <div class="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
    {#each chats as chat (chat.id)}
      <div
        role="button"
        tabindex="0"
        onclick={() => onSelectChat(chat.id)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectChat(chat.id); } }}
        class="rounded-lg px-3 py-2 mb-1 cursor-pointer flex items-center justify-between transition-colors {chat.id === activeChatId ? 'glass-primary border border-white/30' : 'hover:glass-surface'}"
      >
        <span class="truncate max-w-[140px]">{chat.name}</span>
        <button
          class="ml-2 text-xs text-red-400 hover:text-red-600 glass-surface"
          onclick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
          aria-label="Delete chat"
        >✕</button>
      </div>
    {/each}
  </div>

  <footer class="p-2 border-t border-surface-500/20 flex flex-col gap-2">
    <button
      class="w-full flex items-center gap-2 p-2 rounded-lg glass-surface hover:glass-primary text-xs"
    >
      <IconSettings size={14} />
      <span>Settings</span>
    </button>
    <div
      class="text-[10px] text-surface-500/70 p-1 border-t border-surface-500/10 pt-2"
    >
      Debug: Rendering sidebar with {chats.length} chats. Active URL ID: {activeChatId || "None"}
    </div>
  </footer>
</aside>

<style>
  /* Sidebar should stretch to match ChatWindow + ChatInput height */
  aside.glass-surface {
    height: 100%;
    min-height: 0;
    max-height: none;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
  }
  .flex-1 {
    min-height: 0;
  }
</style>

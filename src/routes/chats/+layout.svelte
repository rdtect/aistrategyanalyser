<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import type { LayoutData } from "./$types";
  import { onMount } from "svelte";

  // Add these state variables at the top of your script
  let windowWidth = $state(browser ? window.innerWidth : 1024);
  const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint

  // Get data from layout server load
  let { data, children } = $props<{
    data: LayoutData;
    children: any;
  }>();

  // Combined chats state
  let allChats = $state<any[]>([]);

  // Track sidebar state
  let sidebarCollapsed = $state(false);
  $effect(() => {
    if (!browser) return;

    const handleResize = () => {
      windowWidth = window.innerWidth;
      if (windowWidth <= MOBILE_BREAKPOINT) {
        sidebarCollapsed = true;
      } else {
        sidebarCollapsed = false;
      }
    };

    // Set initial state
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // Merge sample chats with user chats from localStorage
  function loadUserChats() {
    if (!browser) return;

    try {
      // Start with sample chats
      allChats = [...data.sampleChats];

      // Get user chats from localStorage
      const userChatsJson = localStorage.getItem("userChats");
      if (userChatsJson) {
        const userChats = JSON.parse(userChatsJson);

        // Add user chats that don't exist in sample chats
        userChats.forEach((userChat: any) => {
          if (!allChats.find((c) => c.id === userChat.id)) {
            allChats.push(userChat);
          }
        });
      }
    } catch (error) {
      console.error("Error loading user chats:", error);
    }
  }

  // Load combined chats when component mounts
  onMount(() => {
    loadUserChats();

    // Setup storage event listener to reload chats if localStorage changes
    if (browser) {
      window.addEventListener("storage", (event) => {
        if (event.key === "userChats") {
          loadUserChats();
        }
      });

      // Also reload when custom event is dispatched
      window.addEventListener("userChatsUpdated", () => {
        loadUserChats();
      });
    }
  });

  // Get the current chat ID from URL to highlight active chat
  $effect(() => {
    const currentChatId = $page.params.id;
  });

  // Format date function
  function formatDate(date: string | Date): string {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Toggle sidebar
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }
</script>

<!-- Main container with full height -->
<div
  class="h-full w-full overflow-hidden flex flex-col mx-auto border border-surface-200-700 dark:border-surface-500 rounded-xl"
>
  <!-- Chat interface shell -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar with relative positioning for the toggle button -->
    <div
      class="relative h-full {sidebarCollapsed
        ? 'w-0'
        : 'w-64'} transition-all duration-300"
    >
      <aside
        class="h-full border-r border-surface-200-700 dark:border-surface-500 overflow-y-auto transition-all duration-300 {sidebarCollapsed
          ? 'w-0 opacity-0'
          : 'w-64 opacity-100'}"
      >
        <div class="p-4">
          <div class="mb-4">
            <a
              href="/chats/new"
              class="btn preset-soft-primary bg-surface-500/20 hover:bg-primary-50/10 w-full mb-2"
              ><span> &plus; </span><span> New Analysis </span></a
            >
            <hr class="hr mb-2" />

            <h2 class="text-lg font-bold">Recent Analyses</h2>
          </div>

          <div class="space-y-2">
            <!-- Render chat list from combined allChats array -->
            {#if allChats?.length > 0}
              {#each allChats as chat}
                <a
                  href={`/chats/${chat.id}`}
                  class="block p-2 rounded hover:bg-surface-100-800-hover transition-colors {$page
                    .params.id === chat.id
                    ? 'bg-primary-500/50'
                    : ''}"
                >
                  <div class="font-medium truncate">{chat.name}</div>
                  <div class="flex flex-wrap gap-x-1 text-xs text-surface-200">
                    {#if chat.company}
                      <span>{chat.company}</span>
                    {/if}
                    {#if chat.industry}
                      <span>• {chat.industry}</span>
                    {/if}
                    <div class="w-full mt-1">
                      {formatDate(chat.createdAt)}
                    </div>
                  </div>
                </a>
              {/each}
            {:else}
              <div class="text-sm text-surface-500 italic">
                No analyses yet. Create your first one!
              </div>
            {/if}
          </div>
        </div>
      </aside>

      <!-- Sidebar toggle button - outside when closed, inside when open -->
      <button
        class="{sidebarCollapsed
          ? '-right-6 rotate-180'
          : 'left-54'} absolute top-4 z-20 bg-surface-800 border border-primary-600 hover:bg-primary-900 text-surface-200 p-2 rounded-md transition-all duration-300"
        onclick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><polyline points="15 18 9 12 15 6"></polyline></svg
        >
      </button>
    </div>

    <!-- Main content area -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Child pages will render their content here -->
      {@render children()}
    </main>
  </div>
</div>

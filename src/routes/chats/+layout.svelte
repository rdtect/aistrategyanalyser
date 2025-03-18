<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  
  // Get data from layout server load
  let { data, children } = $props<{ 
    data: LayoutData;
    children: any;
  }>();
  
  // Track sidebar state
  let sidebarCollapsed = $state(false);
  
  // Get the current chat ID from URL to highlight active chat
  $effect(() => {
    const currentChatId = $page.params.id;
  });
  
  // Format date function
  function formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Toggle sidebar
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }
</script>

<!-- Main container with adjusted height for better visibility -->
<div class="h-[90vh] max-h-[90vh] w-full overflow-hidden flex flex-col mx-auto my-2 border border-surface-200-700 dark:border-surface-500 rounded-xl">
  <!-- Chat interface shell -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar with relative positioning for the toggle button -->
    <div class="relative h-full {sidebarCollapsed ? 'w-0' : 'w-64'}">
      <aside 
        class="h-full border-r border-surface-200-700 dark:border-surface-500 overflow-y-auto transition-all duration-300 {
          sidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'
        }"
      >
        <div class="p-4">
          <div class="mb-4">
            <h2 class="text-lg font-bold">Recent</h2>
            <a href="/chats/new" class="btn btn-sm bg-surface-50/10 hover:bg-primary-50/10 w-full mt-2">New Analysis</a>
          </div>
          
          <div class="space-y-2">
            <!-- Render chat list from data -->
            {#if data?.chats?.length > 0}
              {#each data.chats as chat}
                <a 
                  href={`/chats/${chat.id}`}
                  class="block p-2 rounded hover:bg-surface-100-800-hover transition-colors {$page.params.id === chat.id ? 'bg-primary-500/50' : ''}"
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
        class="{sidebarCollapsed ? '-left-4' : 'left-54'} absolute top-4 z-20 bg-surface-800 border border-surface-600 hover:bg-surface-700 text-surface-300 p-2 rounded-md transition-all duration-300"
        onclick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {#if sidebarCollapsed}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {/if}
      </button>
    </div>
    
    <!-- Main content area -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Child pages will render their content here -->
      {@render children()}
    </main>
  </div>
</div>
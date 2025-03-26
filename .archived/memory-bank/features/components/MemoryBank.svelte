<script lang="ts">
  import { memoryStore } from "$lib/features/memory-bank/stores/MemoryStore.svelte.ts";
  import { number } from "zod";
  import type { MemoryCategory, MemorySource } from '../types/memory';
  
  // Local state using Svelte 5 runes
  let searchTerm = $state('');
  let selectedCategories = $state<MemoryCategory[]>([]);
  let selectedSources = $state<MemorySource[]>([]);
  let selectedTags = $state<string[]>([]);
  
  // Derived values with proper typing
  let stats = $derived(memoryStore.memoryStats);
  let memories = $derived(memoryStore.filteredMemories);
  let isLoading = $derived(memoryStore.isLoading);
  let error = $derived(memoryStore.error);
  
  // Available categories and sources for filtering
  const categories: MemoryCategory[] = ['fact', 'insight', 'question', 'action', 'reference', 'custom'];
  const sources: MemorySource[] = ['chat', 'user', 'document', 'web', 'system'];
  
  // Ensure proper typing for category counts
  type CategoryCount = Record<string, number>;
  $effect(() => {
    if (stats.categoryCounts) {
      // Validate that categoryCounts is properly typed
      console.log("Category counts loaded:", Object.keys(stats.categoryCounts).length);
    }
  });
  
  // Handle search input
  function handleSearch() {
    memoryStore.updateFilter({ searchTerm });
  }
  
  // Handle category selection
  function toggleCategory(category: MemoryCategory) {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      selectedCategories = [...selectedCategories, category];
    }
    memoryStore.updateFilter({ categories: selectedCategories });
  }
  
  // Handle source selection
  function toggleSource(source: MemorySource) {
    if (selectedSources.includes(source)) {
      selectedSources = selectedSources.filter(s => s !== source);
    } else {
      selectedSources = [...selectedSources, source];
    }
    memoryStore.updateFilter({ sources: selectedSources });
  }
  
  // Handle tag selection
  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    memoryStore.updateFilter({ tags: selectedTags });
  }
  
  // Reset all filters
  function resetFilters() {
    searchTerm = '';
    selectedCategories = [];
    selectedSources = [];
    selectedTags = [];
    memoryStore.resetFilter();
  }
  
  // Create a new memory
  function createMemory() {
    const content = prompt('Enter memory content:');
    if (content) {
      memoryStore.createMemory(content, 'fact', 'user', []);
    }
  }
  
  // Delete a memory
  function deleteMemory(id: string) {
    if (confirm('Are you sure you want to delete this memory?')) {
      memoryStore.deleteMemory(id);
    }
  }
  
  // Format date for display
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
  
  // Get CSS class for memory category
  function getCategoryClass(category: MemoryCategory): string {
    const classes = {
      fact: 'bg-blue-100 text-blue-800',
      insight: 'bg-purple-100 text-purple-800',
      question: 'bg-yellow-100 text-yellow-800',
      action: 'bg-green-100 text-green-800',
      reference: 'bg-gray-100 text-gray-800',
      custom: 'bg-pink-100 text-pink-800'
    };
    return classes[category] || classes.custom;
  }
  
  // Get CSS class for memory source
  function getSourceClass(source: MemorySource): string {
    const classes = {
      chat: 'bg-indigo-100 text-indigo-800',
      user: 'bg-teal-100 text-teal-800',
      document: 'bg-orange-100 text-orange-800',
      web: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return classes[source] || classes.system;
  }
  
  // Initialize the component
  $effect(() => {
    // Load memories when component is mounted
    memoryStore.loadMemories();
  });
</script>

<div class="memory-bank">
  <div class="mb-6">
    <h2 class="text-2xl font-bold mb-2">Memory Bank</h2>
    <p class="text-gray-600">
      Store and retrieve important information and insights
    </p>
  </div>
  
  <!-- Stats -->
  <div class="stats bg-base-200 p-4 rounded-lg mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat">
        <div class="stat-title">Total Memories</div>
        <div class="stat-value">{stats.totalMemories}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Categories</div>
        <div class="stat-desc flex flex-wrap gap-1 mt-2">
          {#each Object.entries(stats.categoryCounts as CategoryCount) as [category, count]}
            {#if count > 0}
              <span class={`badge ${getCategoryClass(category as MemoryCategory)}`}>
                {category}: {count}
              </span>
            {/if}
          {/each}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">Top Tags</div>
        <div class="stat-desc flex flex-wrap gap-1 mt-2">
          {#each stats.topTags as {tag, count}}
            <button 
              type="button"
              class="badge badge-outline"
              onclick={() => toggleTag(tag)}
              onkeydown={(e) => e.key === 'Enter' && toggleTag(tag)}
              aria-label={`Filter by tag ${tag}`}
            >
              {tag} ({count})
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Search and Filters -->
  <div class="filters bg-base-100 p-4 rounded-lg mb-6">
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex-grow">
        <div class="input-group">
          <input 
            type="text" 
            placeholder="Search memories..." 
            class="input input-bordered w-full" 
            bind:value={searchTerm}
            oninput={handleSearch}
          />
          <button 
            class="btn btn-square" 
            onclick={handleSearch}
            aria-label="Search memories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" onclick={createMemory}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          New Memory
        </button>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2 mb-2">
      <span class="font-medium">Categories:</span>
      {#each categories as category}
        <button 
          type="button"
          class={`badge cursor-pointer ${getCategoryClass(category)} ${selectedCategories.includes(category) ? 'ring-2 ring-offset-2' : ''}`}
          onclick={() => toggleCategory(category)}
          onkeydown={(e) => e.key === 'Enter' && toggleCategory(category)}
          aria-pressed={selectedCategories.includes(category)}
        >
          {category}
        </button>
      {/each}
    </div>
    
    <div class="flex flex-wrap gap-2 mb-2">
      <span class="font-medium">Sources:</span>
      {#each sources as source}
        <button 
          type="button"
          class={`badge cursor-pointer ${getSourceClass(source)} ${selectedSources.includes(source) ? 'ring-2 ring-offset-2' : ''}`}
          onclick={() => toggleSource(source)}
          onkeydown={(e) => e.key === 'Enter' && toggleSource(source)}
          aria-pressed={selectedSources.includes(source)}
        >
          {source}
        </button>
      {/each}
    </div>
    
    {#if selectedTags.length > 0}
      <div class="flex flex-wrap gap-2 mb-2">
        <span class="font-medium">Selected Tags:</span>
        {#each selectedTags as tag}
          <button 
            type="button"
            class="badge badge-outline cursor-pointer ring-2 ring-offset-2"
            onclick={() => toggleTag(tag)}
            onkeydown={(e) => e.key === 'Enter' && toggleTag(tag)}
            aria-label={`Remove tag ${tag}`}
          >
            {tag} ×
          </button>
        {/each}
      </div>
    {/if}
    
    <div class="flex justify-end">
      <button class="btn btn-sm btn-ghost" onclick={resetFilters}>
        Reset Filters
      </button>
    </div>
  </div>
  
  <!-- Memory List -->
  <div class="memories">
    {#if isLoading}
      <div class="flex justify-center p-8">
        <div class="loading loading-spinner loading-lg"></div>
      </div>
    {:else if error}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
        <button class="btn btn-sm" onclick={() => memoryStore.clearError()}>Dismiss</button>
      </div>
    {:else if memories.length === 0}
      <div class="text-center p-8 bg-base-200 rounded-lg">
        <p class="text-lg mb-4">No memories found</p>
        <button class="btn btn-primary" onclick={createMemory}>Create your first memory</button>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-4">
        {#each memories as memory (memory.id)}
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <div class="flex justify-between items-start">
                <div class="flex gap-2 mb-2">
                  <span class={`badge ${getCategoryClass(memory.category)}`}>{memory.category}</span>
                  <span class={`badge ${getSourceClass(memory.source)}`}>{memory.source}</span>
                </div>
                <div class="dropdown dropdown-end">
                  <button 
                    type="button"
                    class="btn btn-ghost btn-xs"
                    aria-haspopup="menu"
                    aria-label="Memory actions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" role="menu">
                    <li role="menuitem">
                      <button onclick={() => memoryStore.setActiveMemory(memory.id)}>View Details</button>
                    </li>
                    <li role="menuitem">
                      <button onclick={() => deleteMemory(memory.id)}>Delete</button>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p class="whitespace-pre-line">{memory.content}</p>
              
              {#if memory.tags.length > 0}
                <div class="flex flex-wrap gap-1 mt-2">
                  {#each memory.tags as tag}
                    <button 
                      type="button"
                      class="badge badge-sm badge-outline cursor-pointer"
                      onclick={() => toggleTag(tag)}
                      onkeydown={(e) => e.key === 'Enter' && toggleTag(tag)}
                      aria-label={`Filter by tag ${tag}`}
                    >
                      {tag}
                    </button>
                  {/each}
                </div>
              {/if}
              
              <div class="text-xs text-gray-500 mt-2">
                Created: {formatDate(memory.createdAt)}
                {#if memory.createdAt !== memory.updatedAt}
                  | Updated: {formatDate(memory.updatedAt)}
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .memory-bank {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
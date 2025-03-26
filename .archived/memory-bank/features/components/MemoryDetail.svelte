<script lang="ts">
  import { memoryStore } from '../stores/MemoryStore.svelte';
  import type { MemoryCategory, MemorySource } from '../types/memory';
  
  // Props
  let { memoryId } = $props<{ memoryId: string }>();
  
  // Local state
  let isEditing = $state(false);
  let editedContent = $state('');
  let editedCategory = $state<MemoryCategory>('fact');
  let editedTags = $state('');
  
  // Derived values
  let memory = $derived(memoryStore.activeMemory);
  let isLoading = $derived(memoryStore.isLoading);
  let error = $derived(memoryStore.error);
  
  // Available categories for editing
  const categories: MemoryCategory[] = ['fact', 'insight', 'question', 'action', 'reference', 'custom'];
  
  // Start editing the memory
  function startEditing() {
    if (memory) {
      editedContent = memory.content;
      editedCategory = memory.category;
      editedTags = memory.tags.join(', ');
      isEditing = true;
    }
  }
  
  // Save edited memory
  async function saveMemory() {
    if (!memory) return;
    
    try {
      // Parse tags from comma-separated string
      const tags = editedTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Update the memory
      await memoryStore.updateMemory(memory.id, {
        content: editedContent,
        category: editedCategory,
        tags
      });
      
      // Exit editing mode
      isEditing = false;
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }
  
  // Cancel editing
  function cancelEditing() {
    isEditing = false;
  }
  
  // Delete the memory
  function deleteMemory() {
    if (!memory) return;
    
    if (confirm('Are you sure you want to delete this memory?')) {
      memoryStore.deleteMemory(memory.id);
      closeDetail();
    }
  }
  
  // Close the detail view
  function closeDetail() {
    memoryStore.setActiveMemory(null);
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
  
  // Set the active memory when the component is mounted
  $effect(() => {
    memoryStore.setActiveMemory(memoryId);
  });
</script>

<div class="memory-detail">
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
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
      {:else if !memory}
        <div class="text-center p-8">
          <p class="text-lg mb-4">Memory not found</p>
          <button class="btn btn-primary" onclick={closeDetail}>Go Back</button>
        </div>
      {:else}
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Memory Details</h2>
          <button 
            class="btn btn-sm btn-ghost" 
            onclick={closeDetail}
            aria-label="Close memory details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Memory Content -->
        {#if isEditing}
          <!-- Edit Mode -->
          <div class="form-control mb-4">
            <label for="memory-content" class="label">
              <span class="label-text">Content</span>
            </label>
            <textarea 
              id="memory-content"
              class="textarea textarea-bordered h-32" 
              placeholder="Memory content" 
              bind:value={editedContent}
            ></textarea>
          </div>
          
          <div class="form-control mb-4">
            <label for="memory-category" class="label">
              <span class="label-text">Category</span>
            </label>
            <select 
              id="memory-category"
              class="select select-bordered w-full" 
              bind:value={editedCategory}
            >
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div class="form-control mb-4">
            <label for="memory-tags" class="label">
              <span class="label-text">Tags (comma-separated)</span>
            </label>
            <input 
              id="memory-tags"
              type="text" 
              class="input input-bordered" 
              placeholder="tag1, tag2, tag3" 
              bind:value={editedTags}
            />
          </div>
          
          <div class="flex justify-end gap-2">
            <button class="btn btn-ghost" onclick={cancelEditing}>Cancel</button>
            <button class="btn btn-primary" onclick={saveMemory}>Save</button>
          </div>
        {:else}
          <!-- View Mode -->
          <div class="flex gap-2 mb-4">
            <span class={`badge ${getCategoryClass(memory.category)}`}>{memory.category}</span>
            <span class={`badge ${getSourceClass(memory.source)}`}>{memory.source}</span>
          </div>
          
          <div class="mb-6">
            <p class="whitespace-pre-line">{memory.content}</p>
          </div>
          
          {#if memory.tags.length > 0}
            <div class="flex flex-wrap gap-1 mb-4">
              <span class="font-medium mr-2">Tags:</span>
              {#each memory.tags as tag}
                <span class="badge badge-outline">{tag}</span>
              {/each}
            </div>
          {/if}
          
          <div class="text-sm text-gray-500 mb-6">
            <div>Created: {formatDate(memory.createdAt)}</div>
            {#if memory.createdAt !== memory.updatedAt}
              <div>Updated: {formatDate(memory.updatedAt)}</div>
            {/if}
          </div>
          
          {#if memory.metadata}
            <div class="collapse collapse-arrow bg-base-200 mb-4">
              <input type="checkbox" /> 
              <div class="collapse-title font-medium">
                Metadata
              </div>
              <div class="collapse-content"> 
                <pre class="text-xs overflow-auto">{JSON.stringify(memory.metadata, null, 2)}</pre>
              </div>
            </div>
          {/if}
          
          <div class="flex justify-end gap-2">
            <button class="btn btn-outline btn-error" onclick={deleteMemory}>Delete</button>
            <button class="btn btn-primary" onclick={startEditing}>Edit</button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .memory-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
<script lang="ts">
  import Download from 'lucide-svelte/icons/download';
  import MoreVertical from 'lucide-svelte/icons/more-vertical';
  
  // Props
  let { chatId } = $props<{ chatId: string }>();
  
  // State
  let isExporting = $state(false);
  let popupOpen = $state(false);
  
  // Handle export
  async function exportAnalysis(format: 'markdown' | 'html' | 'json') {
    if (isExporting) return;
    isExporting = true;
    
    try {
      // Trigger file download
      window.location.href = `/api/chats/${chatId}/export?format=${format}`;
      
      // Show success notification
      console.log(`Exporting as ${format.toUpperCase()}`);
      // Close popup after selection
      popupOpen = false;
    } catch (error) {
      console.error('Export error:', error);
      
      // Show error notification
      console.error('Export failed');
    } finally {
      isExporting = false;
    }
  }
  
  // Toggle popup
  function togglePopup() {
    popupOpen = !popupOpen;
  }
</script>

<div class="relative">
  <button
    class="btn btn-sm variant-ghost-surface"
    onclick={togglePopup}
  >
    <Download />
    <span class="hidden sm:inline">Export</span>
  </button>
  
  {#if popupOpen}
    <div class="card p-2 w-48 shadow-xl absolute right-0 top-full mt-1 z-10">
      <div class="space-y-2">
        <button 
          class="btn btn-sm w-full variant-soft justify-start"
          onclick={() => exportAnalysis('markdown')}
          disabled={isExporting}
        >
          Export as Markdown
        </button>
        
        <button 
          class="btn btn-sm w-full variant-soft justify-start"
          onclick={() => exportAnalysis('html')}
          disabled={isExporting}
        >
          Export as HTML
        </button>
        
        <button 
          class="btn btn-sm w-full variant-soft justify-start"
          onclick={() => exportAnalysis('json')}
          disabled={isExporting}
        >
          Export as JSON
        </button>
      </div>
    </div>
  {/if}
</div> 
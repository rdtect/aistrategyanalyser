<script lang="ts">
  import { FileDown } from 'lucide-svelte';
  import chatStore from './Chat.svelte.js';
  
  interface Props {
    chatId: string;
  }

  let { chatId }: Props = $props();
  
  async function exportChat() {
    try {
      // Use the chatStore's exportToMarkdown method
      chatStore.exportToMarkdown();
    } catch (error) {
      console.error("Error exporting chat:", error);
      alert("Failed to export chat");
    }
  }
</script>

<button 
  class="btn btn-sm variant-filled-primary"
  onclick={exportChat}
  title="Export chat"
>
  <FileDown size={18} />
  <span class="hidden md:inline ml-1">Export</span>
</button> 
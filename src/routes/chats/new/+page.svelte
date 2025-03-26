<script lang="ts">
  import { goto } from '$app/navigation';
  import AnalysisCreation from '../(components)/AnalysisCreation.svelte';
  import { chatStore } from '../(components)/ChatStore.svelte';
  
  function handleClose() {
    goto('/chats');
  }
  
  // To control the analysis creation
  let analysisCreationComponent: any;
</script>

<div class="h-full w-full flex items-start justify-center p-4 pt-8 relative">
  <!-- Analysis creation widget -->
  <div class="flex-1 max-w-xl">
    <AnalysisCreation onClose={handleClose} bind:this={analysisCreationComponent} />
  </div>
  

</div>
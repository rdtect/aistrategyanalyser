<script lang="ts">
  import { goto } from '$app/navigation';
  import AnalysisCreation from '../(components)/AnalysisCreation.svelte';
  // chatStore is likely used within AnalysisCreation, keeping import here might be redundant if not used directly
  // import { chatStore } from '../(components)/ChatStore.svelte';

  // Import page data type
  import type { PageData } from './$types';

  // Access page data loaded by +page.server.ts
  const props = $props<{ data: PageData }>(); // Get props object
  
  function handleClose() {
    goto('/chats');
  }
  
  // To control the analysis creation
  let analysisCreationComponent: any;
</script>

<div class="h-full w-full flex items-start justify-center p-4 pt-8 relative">
  <!-- Analysis creation widget -->
  <div class="flex-1 max-w-xl">
    <AnalysisCreation 
      categories={props.data.categories} 
      onClose={handleClose} 
      bind:this={analysisCreationComponent} 
    />
  </div>
  

</div>
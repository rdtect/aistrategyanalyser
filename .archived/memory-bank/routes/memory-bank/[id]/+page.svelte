<script lang="ts">
  import { MemoryDetail } from '$lib/features/memory-bank';
  import { page } from '$app/stores';
  
  // Get the memory ID from the URL
  let memoryId = $derived($page.params.id);
</script>

<div class="container mx-auto py-8">
  <MemoryDetail memoryId={memoryId} />
</div>
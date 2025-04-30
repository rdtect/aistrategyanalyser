<script lang="ts">
  import { goto } from "$app/navigation";
  import AnalysisCreation from "../(lib)/components/AnalysisCreation.svelte";

  // Import page data type
  import type { PageData } from "./$types";

  // Access page data loaded by +page.server.ts
  const data = $props<{ data: PageData }>(); // Get props object

  function handleClose() {
    goto("/chats");
  }

  // To control the analysis creation
  let analysisCreationComponent: any;

  // Add error/loading handling for categories data
  const hasCategories = $derived(!!data.categories && data.categories.length > 0);
</script>

<div class="h-full w-full flex items-start justify-center p-4 pt-8 relative">
  <!-- Analysis creation widget -->
  <div class="flex-1 max-w-xl">
    {#if !hasCategories}
      <div class="p-4 text-center text-surface-400">Loading categories...</div>
    {:else}
      <AnalysisCreation
        categories={data.categories}
        onClose={handleClose}
        bind:this={analysisCreationComponent}
      />
    {/if}
  </div>
</div>

<style>
  /* Fix for -webkit-text-size-adjust error on line 205 */
  :global(html),
  :global(:host) {
    -webkit-text-size-adjust: 100%;
  }

  /* Fix for border-top-width error on line 638 */
  :global(
    :is(.prose)
      :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *))
  ) {
    border-top-width: 1px;
  }

  /* Fix for webkit-appearance error on line 1556 */
  :global(:is(.progress)::-webkit-progress-bar) {
    -webkit-appearance: none;
    appearance: none;
  }

  /* Fix for unexpected 'a' declaration on line 1965 */
  :global(.card) {
    position: relative;
    display: flex;
    flex-direction: column;
  }
</style>

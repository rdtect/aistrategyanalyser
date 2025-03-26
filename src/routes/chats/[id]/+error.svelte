<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
</script>

<div class="flex items-center justify-center h-full w-full">
  <div class="max-w-md p-8 bg-surface-200-700-token rounded-lg shadow-lg text-center">
    <h1 class="text-4xl font-bold text-primary-500 mb-4">{page.status || 500}</h1>
    <h2 class="text-2xl font-semibold mb-4">
      {#if page.status === 404}
        Chat Not Found
      {:else if page.status === 500}
        Server Error
      {:else}
        Something Went Wrong
      {/if}
    </h2>
    <p class="mb-6 text-lg">
      {page.error?.message || "We couldn't find the chat you're looking for."}
    </p>
    <div class="flex gap-4 justify-center">
      <button class="btn variant-filled-primary" on:click={() => goto('/chats')}>
        View All Chats
      </button>
      <a href="/" class="btn variant-ghost-primary">
        Home
      </a>
    </div>
  </div>
</div>

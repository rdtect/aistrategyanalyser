<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
</script>

<div class="card p-6 variant-filled-error max-w-md mx-auto mt-8">
  <h2 class="text-xl font-bold mb-4">Error: {$page.status}</h2>
  <p class="mb-4">{$page.error?.message || 'An error occurred while loading this chat'}</p>
  
  {#if $page.status === 404}
    <p class="mb-4">This chat could not be found. It may have been deleted or never existed.</p>
  {/if}
  
  <div class="flex gap-4">
    <button class="btn variant-filled" on:click={() => goto('/')}>
      Return to Home
    </button>
    <button class="btn variant-ghost" on:click={() => goto('/chats/new')}>
      Create New Chat
    </button>
  </div>
</div>
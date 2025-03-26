<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="flex items-center justify-center h-full w-full">
  <div class="max-w-md p-8 bg-surface-200-700-token rounded-lg shadow-lg text-center">
    <h1 class="text-4xl font-bold text-primary-500 mb-4">{page.status || 500}</h1>
    <h2 class="text-2xl font-semibold mb-4">
      {#if page.status === 404}
        Page Not Found
      {:else if page.status === 500}
        Server Error
      {:else}
        Something Went Wrong
      {/if}
    </h2>
    <p class="mb-6 text-lg">
      {page.error?.message || "We're sorry, but something unexpected happened."}
    </p>
    <a href="/" class="btn variant-filled-primary">
      Return Home
    </a>
  </div>
</div>

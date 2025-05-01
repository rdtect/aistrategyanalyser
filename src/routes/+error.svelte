<script lang="ts">
  import { page } from '$app/state';
  // Removed App import, rely on global App.Error type

  // Explicitly get reactive values from the store
  let status = $derived(page.status);
  let error = $derived(page.error as App.Error | null);
</script>

<div class="flex items-center justify-center h-full w-full p-4">
  <!-- Applied .glass-surface utility to the card -->
  <div class="card glass-surface max-w-md p-8 text-center">
    <h1 class="h1 mb-4">{status || 500}</h1>
    <h2 class="h3 mb-4">
      {#if status === 404}
        Page Not Found
      {:else if status === 503 && error?.message.includes('OpenAI API Key')}
        OpenAI Configuration Error
      {:else if status === 429 && error?.message.includes('OpenAI Rate Limit')}
        OpenAI Rate Limit Exceeded
      {:else if status === 504 && error?.message.includes('Cannot connect to OpenAI')}
        OpenAI Connection Error
      {:else if status === 500}
        Server Error
      {:else}
        Something Went Wrong
      {/if}
    </h2>
    <p class="mb-6 text-lg">
      {#if status === 503 && error?.message.includes('OpenAI API Key')}
        Please check your OpenAI API key in the settings.
      {:else if status === 429 && error?.message.includes('OpenAI Rate Limit')}
        Too many requests sent to OpenAI. Please try again later.
      {:else if status === 504 && error?.message.includes('Cannot connect to OpenAI')}
        Could not establish a connection to the OpenAI service. Please check your network or try again later.
      {:else}
        {error?.message || "We're sorry, but something unexpected happened."}
      {/if}
    </p>
    <a href="/" class="btn preset-filled-primary">
      Return Home
    </a>
  </div>
</div>

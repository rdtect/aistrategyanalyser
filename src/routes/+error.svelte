<script>
  import { page } from '$app/stores';
</script>

<div class="container h-full flex justify-center items-center flex-col gap-4 p-4">
  <div class="card p-4 variant-filled-error flex flex-col items-center gap-2 max-w-md w-full">
    <h1 class="h1">{$page.status}</h1>
    <p class="text-center">{$page.error?.message || 'An unexpected error occurred'}</p>
    
    {#if $page.status === 404}
      <p>We couldn't find the page you were looking for.</p>
    {:else if $page.status === 500}
      <p>Something went wrong on our end. Please try again later.</p>
    {/if}
    
    <a href="/" class="btn variant-filled mt-4">Go to Home</a>
  </div>
</div>
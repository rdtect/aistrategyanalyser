<!--
  Home Page Redirect
  
  Redirects to the chats page using Svelte 5 features.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // For home page, we just redirect to chats
  onMount(() => {
    goto('/chats');
  });
</script>

<!-- Loading state while redirecting -->
<div class="flex items-center justify-center h-full">
  <div class="text-center">
    <div class="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
    <p class="text-surface-600 dark:text-surface-300">Redirecting to chats...</p>
  </div>
</div>
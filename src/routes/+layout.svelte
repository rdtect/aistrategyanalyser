<!-- Main application layout -->
<script lang="ts">
  import '../app.css';
  import OfflineBanner from '$lib/components/OfflineBanner.svelte';
  import { Toaster } from '@skeletonlabs/skeleton-svelte';
  import { toaster } from '$lib/components/toaster-svelte';
  import { browser } from '$app/environment';
  let { children } = $props();
  // SSR-safe: isOnline is a value, not a function
  let isOnline = browser ? !document.documentElement.classList.contains('app-offline') : true;
</script>

<svelte:head>
  <title>AI Strategy Analyzer</title>
  <meta name="description" content="Analyze business strategies with AI assistance" />
  <meta name="mobile-web-app-capable" content="yes">
</svelte:head>

<Toaster {toaster} />
<OfflineBanner {isOnline} />

<div class="app-root min-h-screen h-screen flex flex-col overflow-hidden">
  {@render children?.()}
</div>

<style>  
  /* main {
    flex: 1;
    display: flex;
    flex-direction: column;
  } */

</style>
<script lang="ts">
  export let isOnline: boolean = true;
</script>

{#if !isOnline}
  <div class="offline-banner bg-red-700 text-white text-center py-2 w-full z-50 fixed top-0 left-0">
    <span>⚠️ You are offline. Some features may not work.</span>
  </div>
{/if}

<style>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 9999;
  pointer-events: none;
}
</style>

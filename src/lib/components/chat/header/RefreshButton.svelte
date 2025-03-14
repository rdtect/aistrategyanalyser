<script lang="ts">
    import { RefreshCw } from 'lucide-svelte';
    import { chatStore } from '../Chat.svelte.ts';
    import { debounce } from '$lib/utils/debounce';

    const debouncedRefresh = debounce(async () => {
        await chatStore.checkApiStatus();
    }, 300);
</script>

<button
    class="btn btn-sm variant-soft p-1"
    on:click={debouncedRefresh}
    disabled={chatStore.isLoading}
    title="Refresh connection status"
>
    <RefreshCw 
        class="h-4 w-4 {chatStore.isLoading ? 'animate-spin' : ''}"
    />
</button>
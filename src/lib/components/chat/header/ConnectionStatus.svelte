<script lang="ts">
    import { chatStore } from '../Chat.svelte.ts';
</script>

<span class="flex items-center gap-1.5 w-l">
    <span 
        class="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
        class:bg-green-500={chatStore.status.isActive}
        class:bg-red-500={!chatStore.status.isActive}
    ></span>
    <span 
        class="text-xs"
        class:text-white={chatStore.status.isActive}
        class:text-red-500={!chatStore.status.isActive}
    >
        {#if chatStore.status.isActive && chatStore.status.openai?.connected}
            Connected ({chatStore.status.openai.model})
        {:else}
            Inactive
        {/if}
    </span>
</span>
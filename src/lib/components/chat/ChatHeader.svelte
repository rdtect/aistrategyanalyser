<script lang="ts">
    import BotIcon from 'lucide-svelte/icons/bot-message-square';
    import { RefreshCw } from 'lucide-svelte';
    import { chatStore } from './Chat.svelte.ts';
    import { debounce } from '$lib/utils/debounce';
    import { AI_MODELS, type AIModel } from '$lib/config/aiModels';

    // Model selector logic
    const modelEntries: [string, { name: string }][] = Object.entries(AI_MODELS);

    const handleModelChange = async (event: Event) => {
        const select = event.currentTarget as HTMLSelectElement;
        const newModel = select.value as AIModel;
        chatStore.settings.model = newModel;
        await chatStore.checkApiStatus();
    };

    // Refresh button logic
    const debouncedRefresh = debounce(async () => {
        await chatStore.checkApiStatus();
    }, 300);
</script>

<div class="border-surface-500 flex h-12 items-center justify-between border-b px-3 py-2">
    <div class="flex items-center gap-2 font-semibold text-white">
        <BotIcon class="h-4 w-4" />
        <span class="text-sm">AI Strategy Analysis Chat</span>
    </div>
    <div class="flex items-center justify-evenly gap-1.5">
        <!-- Connection Status -->
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

        <!-- Model Selector (commented out as in original) -->
        <!-- <input
            type="select" 
            class="select bg-surface-700 text-xs w-fit"
            value={chatStore.settings.model}
            on:change={handleModelChange}
        >
            {#each modelEntries as [id, model]}
                <option value={id}>{model.name}</option>
            {/each}
        </input> -->

        <!-- Refresh Button -->
        <button
            class="btn btn-sm variant-soft p-1"
            onclick={debouncedRefresh}
            disabled={chatStore.isLoading}
            title="Refresh connection status"
        >
            <RefreshCw 
                class="h-4 w-4 {chatStore.isLoading ? 'animate-spin' : ''}"
            />
        </button>
    </div>
</div>
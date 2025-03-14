<script lang="ts">
    import { AI_MODELS, type AIModel } from '$lib/config/aiModels';
    import { chatStore } from '../Chat.svelte.ts';
    import { debounce } from '$lib/utils/debounce';

    const modelEntries: [string, { name: string }][] = Object.entries(AI_MODELS);

    const handleModelChange = async (event: Event) => {
        const select = event.currentTarget as HTMLSelectElement;
        const newModel = select.value as AIModel;
        
        // Update the store's model setting
        chatStore.settings.model = newModel;
        // Explicitly check API status with new model
        await chatStore.checkApiStatus();
    };
</script>

<select 
    class="select bg-surface-700 text-xs w-fit"
    value={chatStore.settings.model}
    on:change={handleModelChange}
>
    {#each modelEntries as [id, model]}
        <option value={id}>{model.name}</option>
    {/each}
</select>